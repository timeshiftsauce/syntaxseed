const { db } = require('../db')
const fs = require('fs').promises
const path = require('path')
const cron = require('node-cron')
const baiduPushService = require('./baiduPushService')
const searchEnginePushService = require('./searchEnginePushService')

/**
 * 将对象中指定键的JSON字符串值转换为仅包含value属性的数组
 * @param {Object} item - 包含目标JSON字符串的对象
 * @param {string} key - 需要解析的JSON字符串对应的键名
 * @returns {Array} 解析后的数组，每个元素为原JSON数组中对象的value属性值
 */
function JsonToArray(item, key) {
  try {
    if (!item[key]) return []
    const parsed = JSON.parse(item[key])
    if (!Array.isArray(parsed)) return []
    return parsed.map((i) => i.value || i)
  } catch (error) {
    console.error(`解析JSON失败 (${key}):`, error)
    return []
  }
}

class SitemapService {
  constructor() {
    this.sitemapPath = path.join(__dirname, '../public/sitemap.xml')
    this.baseUrl = process.env.BASE_URL || 'https://shiqianjiang.cn'
    this.isGenerating = false
    this.lastUrlsPath = path.join(__dirname, '../logs/last-pushed-urls.json')
    this.enableBaiduPush = process.env.ENABLE_BAIDU_PUSH !== 'false' // 默认启用
  }

  /**
   * 获取所有URL列表（用于推送）
   */
  async getAllUrls() {
    try {
      const urls = []

      // 添加静态页面
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/projects', priority: '0.9', changefreq: 'weekly' },
        { url: '/blog', priority: '0.9', changefreq: 'daily' },
        { url: '/timeline', priority: '0.7', changefreq: 'monthly' }
      ]

      staticPages.forEach(page => {
        urls.push(`${this.baseUrl}${page.url}`)
      })

      // 并行获取所有动态内容
      const [blogPosts, projects] = await Promise.all([
        Promise.race([
          this.getBlogPosts(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('获取博客文章超时')), 10000)
          )
        ]).catch(() => []),
        Promise.race([
          this.getProjects(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('获取项目超时')), 10000)
          )
        ]).catch(() => [])
      ])

      // 添加博客文章URL
      if (blogPosts && Array.isArray(blogPosts)) {
        blogPosts.forEach(post => {
          urls.push(`${this.baseUrl}/blog/${post.slug}`)
        })
      }

      // 添加项目URL
      if (projects && Array.isArray(projects)) {
        projects.forEach(project => {
          urls.push(`${this.baseUrl}/projects/${project.slug}`)
        })
      }

      // 添加分类页面URL


      return urls
    } catch (error) {
      console.error('获取URL列表时出错:', error)
      return []
    }
  }

  /**
   * 生成sitemap XML内容
   */
  async generateSitemapXML() {
    try {
      const urls = []

      // 添加静态页面
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/projects', priority: '0.9', changefreq: 'weekly' },
        { url: '/blog', priority: '0.9', changefreq: 'daily' },
        { url: '/timeline', priority: '0.7', changefreq: 'monthly' }
      ]

      staticPages.forEach(page => {
        urls.push({
          loc: `${this.baseUrl}${page.url}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: page.changefreq,
          priority: page.priority
        })
      })

      // 并行获取所有动态内容，设置超时
      const [blogPosts, projects] = await Promise.all([
        Promise.race([
          this.getBlogPosts(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('获取博客文章超时')), 10000)
          )
        ]),
        Promise.race([
          this.getProjects(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('获取项目超时')), 10000)
          )
        ])
      ])

      // 添加博客文章URL
      blogPosts.forEach(post => {
        urls.push({
          loc: `${this.baseUrl}/blog/${post.slug}`,
          lastmod: post.updated_at || post.created_at,
          changefreq: 'monthly',
          priority: '0.8'
        })
      })

      // 添加项目URL
      projects.forEach(project => {
        urls.push({
          loc: `${this.baseUrl}/projects/${project.slug}`,
          lastmod: project.updated_at || project.created_at,
          changefreq: 'monthly',
          priority: '0.7'
        })
      })


      // 生成XML
      const xml = this.buildXML(urls)
      console.log(`Sitemap生成完成，包含 ${urls.length} 个URL`)
      return xml

    } catch (error) {
      console.error('生成sitemap XML时出错:', error)
      throw error
    }
  }

  /**
   * 构建XML格式
   */
  buildXML(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    urls.forEach(url => {
      xml += '  <url>\n'
      xml += `    <loc>${url.loc}</loc>\n`
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`
      xml += `    <priority>${url.priority}</priority>\n`
      xml += '  </url>\n'
    })

    xml += '</urlset>'
    return xml
  }

  /**
   * 获取博客文章
   */
  async getBlogPosts() {
    try {
      const posts = await db('ba_blogdetail')
        .select(db.raw('CAST(id AS CHAR) as id'),
          'title',
          'create_time')
        .orderBy('create_time', 'desc')
        .timeout(5000)

      return posts.map(post => ({
        ...post,
        // 使用id作为URL路径，因为没有slug字段
        slug: post.id,
        // 处理时间戳，可能是Unix时间戳（秒）或毫秒时间戳
        created_at: post.create_time ?
          (post.create_time > 1000000000000 ?
            new Date(post.create_time).toISOString().split('T')[0] :
            new Date(post.create_time * 1000).toISOString().split('T')[0]
          ) : new Date().toISOString().split('T')[0],
        updated_at: null // 博客表没有update_time字段
      }))
    } catch (error) {
      console.error('获取博客文章时出错:', error)
      return []
    }
  }

  /**
   * 获取项目
   */
  async getProjects() {
    try {
      const projects = await db('ba_project')
        .select() // 获取所有字段，与原API保持一致
        .orderBy('weigh', 'desc') // 按权重排序，与原API保持一致
        .timeout(5000)

      return projects.map(project => ({
        ...project,
        // 使用id作为URL路径
        slug: project.id,
        // 使用项目中可能存在的时间字段，如果没有则使用当前时间
        created_at: project.createtime ? new Date(project.createtime).toISOString().split('T')[0] :
          project.create_time ? new Date(project.create_time).toISOString().split('T')[0] :
            new Date().toISOString().split('T')[0],
        updated_at: null // 项目表没有update_time字段
      }))
    } catch (error) {
      console.error('获取项目时出错:', error)
      return []
    }
  }



  /**
   * 获取分类（从博客标签中提取）
   */
  async getCategories() {
    try {
      const tagsResult = await db('ba_blogdetail')
        .select('tags')
        .whereNotNull('tags')
        .where('tags', '!=', '')
        .distinct()
        .timeout(5000)

      // 解析标签并去重
      const allTags = new Set()
      tagsResult.forEach(row => {
        const tags = JsonToArray(row, 'tags')
        tags.forEach(tag => {
          if (tag && tag.trim()) {
            allTags.add(tag.trim())
          }
        })
      })

      // 转换为sitemap需要的格式
      return Array.from(allTags).map(tag => ({
        slug: encodeURIComponent(tag)
      }))
    } catch (error) {
      console.error('获取分类时出错:', error)
      return []
    }
  }

  /**
   * 保存上次推送的URL列表
   */
  async saveLastPushedUrls(urls) {
    try {
      const dir = path.dirname(this.lastUrlsPath)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(this.lastUrlsPath, JSON.stringify(urls, null, 2), 'utf8')
    } catch (error) {
      console.error('保存上次推送URL列表失败:', error)
    }
  }

  /**
   * 获取上次推送的URL列表
   */
  async getLastPushedUrls() {
    try {
      const content = await fs.readFile(this.lastUrlsPath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [] // 文件不存在，返回空数组
      }
      console.error('读取上次推送URL列表失败:', error)
      return []
    }
  }

  /**
   * 推送URL到百度搜索引擎
   */
  async pushToBaidu(options = {}) {
    if (!this.enableBaiduPush) {
      console.log('百度推送功能已禁用')
      return { success: false, message: '百度推送功能已禁用' }
    }

    try {
      const currentUrls = await this.getAllUrls()

      if (options.pushAll) {
        // 推送所有URL
        console.log('开始推送所有URL到百度搜索引擎...')
        const result = await baiduPushService.batchPushUrls(currentUrls)

        if (result.success) {
          await this.saveLastPushedUrls(currentUrls)
        }

        return result
      } else {
        // 只推送新增URL
        const lastPushedUrls = await this.getLastPushedUrls()
        const result = await baiduPushService.pushNewUrls(currentUrls, lastPushedUrls)

        if (result.success && result.newUrlsCount > 0) {
          await this.saveLastPushedUrls(currentUrls)
        }

        return result
      }
    } catch (error) {
      console.error('推送到百度搜索引擎失败:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * 推送URL到所有搜索引擎
   */
  async pushToAllSearchEngines(options = {}) {
    try {
      const currentUrls = await this.getAllUrls()

      if (options.pushAll) {
        // 推送所有URL到所有搜索引擎
        console.log('开始推送所有URL到所有搜索引擎...')
        const result = await searchEnginePushService.pushToAllEngines(currentUrls)

        if (result.success) {
          await this.saveLastPushedUrls(currentUrls)
        }

        return result
      } else {
        // 只推送新增URL到所有搜索引擎
        const lastPushedUrls = await this.getLastPushedUrls()
        const result = await searchEnginePushService.pushNewUrlsToAllEngines(currentUrls, lastPushedUrls)

        if (result.success && result.newUrlsCount > 0) {
          await this.saveLastPushedUrls(currentUrls)
        }

        return result
      }
    } catch (error) {
      console.error('推送到搜索引擎失败:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * 保存sitemap到文件
   */
  async saveSitemap(options = {}) {
    if (this.isGenerating) {
      console.log('Sitemap正在生成中，跳过此次任务')
      return
    }

    try {
      this.isGenerating = true
      console.log('开始生成sitemap...')

      const xml = await this.generateSitemapXML()

      // 确保目录存在
      const dir = path.dirname(this.sitemapPath)
      await fs.mkdir(dir, { recursive: true })

      // 写入文件
      await fs.writeFile(this.sitemapPath, xml, 'utf8')

      console.log(`Sitemap已生成: ${this.sitemapPath}`)
      console.log(`包含 ${xml.split('<url>').length - 1} 个URL`)

      // 自动推送到百度搜索引擎
      if (options.pushToBaidu !== false && this.enableBaiduPush) {
        console.log('开始推送URL到百度搜索引擎...')
        const pushResult = await this.pushToBaidu({ pushAll: options.pushAll })

        if (pushResult.success) {
          if (pushResult.newUrlsCount > 0) {
            console.log(`成功推送 ${pushResult.newUrlsCount} 个新增URL到百度搜索引擎`)
          } else {
            console.log('没有新增URL需要推送到百度搜索引擎')
          }
        } else {
          console.error('推送到百度搜索引擎失败:', pushResult.message)
        }
      }

    } catch (error) {
      console.error('保存sitemap时出错:', error)
      throw error
    } finally {
      this.isGenerating = false
    }
  }

  /**
   * 启动定期生成任务
   */
  startScheduledGeneration() {
    // 每天凌晨2点生成sitemap并推送到所有搜索引擎
    cron.schedule('0 2 * * *', async () => {
      console.log('🕐 执行定期sitemap生成和搜索引擎推送任务')
      try {
        // 生成sitemap
        await this.saveSitemap({ pushToBaidu: false })

        // 推送新增URL到所有搜索引擎（百度+Bing）
        const result = await this.pushToAllSearchEngines({ pushAll: false })

        if (result.success) {
          if (result.newUrlsCount > 0) {
            console.log(`✅ 定期sitemap生成和搜索引擎推送完成，推送了 ${result.newUrlsCount} 个新增URL到 ${result.successfulEngines} 个搜索引擎`)

            // 显示各搜索引擎推送结果
            Object.entries(result.results).forEach(([engine, engineResult]) => {
              console.log(`   - ${engine.toUpperCase()}: ${engineResult.success ? '✅ 成功' : '❌ 失败'} - ${engineResult.message}`)
            })
          } else {
            console.log('✅ 定期sitemap生成完成，没有新增URL需要推送')
          }
        } else {
          console.error('❌ 定期搜索引擎推送失败:', result.message)
        }
      } catch (error) {
        console.error('❌ 定期sitemap生成和搜索引擎推送任务失败:', error)
      }
    }, {
      timezone: 'Asia/Shanghai'
    })

    // 每天上午10点额外执行一次搜索引擎推送（推送新增URL到百度+Bing）
    cron.schedule('0 10 * * *', async () => {
      console.log('🕙 执行定期搜索引擎推送任务')
      try {
        const result = await this.pushToAllSearchEngines({ pushAll: false })

        if (result.success) {
          if (result.newUrlsCount > 0) {
            console.log(`✅ 定期搜索引擎推送完成，推送了 ${result.newUrlsCount} 个新增URL到 ${result.successfulEngines} 个搜索引擎`)

            // 显示各搜索引擎推送结果
            Object.entries(result.results).forEach(([engine, engineResult]) => {
              console.log(`   - ${engine.toUpperCase()}: ${engineResult.success ? '✅ 成功' : '❌ 失败'} - ${engineResult.message}`)
            })
          } else {
            console.log('✅ 定期搜索引擎推送完成，没有新增URL需要推送')
          }
        } else {
          console.error('❌ 定期搜索引擎推送失败:', result.message)
        }
      } catch (error) {
        console.error('❌ 定期搜索引擎推送任务失败:', error)
      }
    }, {
      timezone: 'Asia/Shanghai'
    })

    // 每天下午6点再次执行搜索引擎推送（推送新增URL到百度+Bing）
    cron.schedule('0 18 * * *', async () => {
      console.log('🕕 执行下午搜索引擎推送任务')
      try {
        const result = await this.pushToAllSearchEngines({ pushAll: false })

        if (result.success) {
          if (result.newUrlsCount > 0) {
            console.log(`✅ 下午搜索引擎推送完成，推送了 ${result.newUrlsCount} 个新增URL到 ${result.successfulEngines} 个搜索引擎`)

            // 显示各搜索引擎推送结果
            Object.entries(result.results).forEach(([engine, engineResult]) => {
              console.log(`   - ${engine.toUpperCase()}: ${engineResult.success ? '✅ 成功' : '❌ 失败'} - ${engineResult.message}`)
            })
          } else {
            console.log('✅ 下午搜索引擎推送完成，没有新增URL需要推送')
          }
        } else {
          console.error('❌ 下午搜索引擎推送失败:', result.message)
        }
      } catch (error) {
        console.error('❌ 下午搜索引擎推送任务失败:', error)
      }
    }, {
      timezone: 'Asia/Shanghai'
    })

    console.log('📅 定期任务已启动:')
    console.log('  - 每天凌晨2点: 生成sitemap + 推送新增URL到所有搜索引擎（百度+Bing）')
    console.log('  - 每天上午10点: 推送新增URL到所有搜索引擎（百度+Bing）')
    console.log('  - 每天下午6点: 推送新增URL到所有搜索引擎（百度+Bing）')
    console.log('  - 时区: Asia/Shanghai')
  }

  /**
   * 手动触发sitemap生成
   */
  async generateNow() {
    try {
      await this.saveSitemap()
      return { success: true, message: 'Sitemap生成成功' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  /**
   * 获取sitemap状态信息
   */
  async getStatus() {
    try {
      const stats = await fs.stat(this.sitemapPath)
      return {
        exists: true,
        lastGenerated: stats.mtime,
        size: stats.size,
        path: this.sitemapPath
      }
    } catch (error) {
      return {
        exists: false,
        lastGenerated: null,
        size: 0,
        path: this.sitemapPath
      }
    }
  }
}

// 创建单例实例
const sitemapService = new SitemapService()

module.exports = sitemapService
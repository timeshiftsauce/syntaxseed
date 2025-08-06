/**
 * Sitemap服务测试脚本
 * 用于验证sitemap功能是否正常工作
 */

const sitemapService = require('./services/sitemapService')
const { testConnection } = require('./db')

async function testSitemapService() {
  console.log('🚀 开始测试Sitemap服务...\n')

  try {
    // 0. 测试数据库连接
    console.log('0. 测试数据库连接...')
    const dbConnected = await testConnection()
    if (!dbConnected) {
      throw new Error('数据库连接失败')
    }
    console.log('✅ 数据库连接成功\n')

    // 1. 测试获取状态
    console.log('1. 测试获取状态...')
    const status = await sitemapService.getStatus()
    console.log('状态:', status)
    console.log('✅ 获取状态成功\n')

    // 2. 测试各个数据获取方法
    console.log('2. 测试数据获取方法...')

    console.log('  - 测试获取博客文章...')
    const blogPosts = await sitemapService.getBlogPosts()
    console.log(`    获取到 ${blogPosts.length} 篇博客文章`)

    console.log('  - 测试获取项目...')
    const projects = await sitemapService.getProjects()
    console.log(`    获取到 ${projects.length} 个项目`)

    console.log('  - 测试获取分类...')
    const categories = await sitemapService.getCategories()
    console.log(`    获取到 ${categories.length} 个分类`)
    console.log('✅ 数据获取测试成功\n')

    // 3. 测试生成XML
    console.log('3. 测试生成XML...')
    const xml = await sitemapService.generateSitemapXML()
    console.log(`XML长度: ${xml.length} 字符`)
    console.log(`URL数量: ${(xml.match(/<url>/g) || []).length}`)
    console.log('XML预览 (前500字符):')
    console.log(xml.substring(0, 500) + '...')
    console.log('✅ 生成XML成功\n')

    // 4. 测试保存sitemap
    console.log('4. 测试保存sitemap...')
    await sitemapService.saveSitemap()
    console.log('✅ 保存sitemap成功\n')

    // 5. 再次检查状态
    console.log('5. 检查保存后的状态...')
    const newStatus = await sitemapService.getStatus()
    console.log('新状态:', newStatus)
    console.log('✅ 状态检查成功\n')

    console.log('🎉 所有测试通过！Sitemap服务工作正常')

  } catch (error) {
    console.error('❌ 测试失败:', error)
    console.error('错误详情:', error.stack)
    process.exit(1)
  }
}

// 运行测试
if (require.main === module) {
  testSitemapService().then(() => {
    console.log('\n测试完成，正在退出...')
    process.exit(0)
  })
}

module.exports = { testSitemapService }
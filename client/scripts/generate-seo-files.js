/**
 * 生成 SEO 相关文件的脚本
 * 运行: node scripts/generate-seo-files.js
 */

import fs from 'fs'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'

// 确保 console 可用
const { log, error } = globalThis.console

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const config = {
  baseUrl: 'https://shiqianjiang.cn',
  outputDir: path.join(__dirname, '../public')
}

// 生成 robots.txt
function generateRobotsTxt() {
  const content = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${config.baseUrl}/sitemap.xml

# 禁止访问的路径
Disallow: /api/
Disallow: /*.json$
Disallow: /node_modules/
Disallow: /src/
Disallow: /dist/

# 爬虫延迟
Crawl-delay: 1

# 特定搜索引擎配置
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Allow: /`

  const filePath = path.join(config.outputDir, 'robots.txt')
  fs.writeFileSync(filePath, content, 'utf8')
  log('✅ robots.txt 生成成功')
}

// 生成基础 sitemap.xml（静态页面）
function generateBasicSitemap() {
  const staticPages = [
    {
      url: config.baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: `${config.baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: `${config.baseUrl}/projects`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: `${config.baseUrl}/timeline`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: `${config.baseUrl}/tech-stack`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    }
  ]

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  staticPages.forEach(page => {
    xml += '  <url>\n'
    xml += `    <loc>${page.url}</loc>\n`
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`
    xml += `    <priority>${page.priority}</priority>\n`
    xml += '  </url>\n'
  })

  xml += '</urlset>'

  const filePath = path.join(config.outputDir, 'sitemap.xml')
  fs.writeFileSync(filePath, xml, 'utf8')
  log('✅ sitemap.xml 生成成功')
}

// 生成 manifest.json
function generateManifest() {
  const manifest = {
    name: 'SyntaxSeed - 开发者成长日志',
    short_name: 'SyntaxSeed',
    description: '记录前端开发学习历程，分享技术心得与项目经验',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2a9d8f',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ],
    categories: ['education', 'productivity', 'developer'],
    lang: 'zh-CN',
    orientation: 'portrait-primary'
  }

  const filePath = path.join(config.outputDir, 'manifest.json')
  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2), 'utf8')
  log('✅ manifest.json 生成成功')
}

// 生成 .well-known/security.txt
function generateSecurityTxt() {
  const content = `Contact: mailto:security@shiqianjiang.cn
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Preferred-Languages: zh-CN, en
Canonical: ${config.baseUrl}/.well-known/security.txt
Policy: ${config.baseUrl}/security-policy`

  const wellKnownDir = path.join(config.outputDir, '.well-known')
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true })
  }

  const filePath = path.join(wellKnownDir, 'security.txt')
  fs.writeFileSync(filePath, content, 'utf8')
  log('✅ security.txt 生成成功')
}

// 主函数
function main() {
  log('🚀 开始生成 SEO 相关文件...')

  // 确保输出目录存在
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true })
  }

  try {
    generateRobotsTxt()
    generateBasicSitemap()
    generateManifest()
    generateSecurityTxt()

    log('🎉 所有 SEO 文件生成完成！')
    log(`📁 文件位置: ${config.outputDir}`)
  } catch (err) {
    error('❌ 生成文件时出错:', err)
    process.exit(1)
  }
}

// 运行脚本
main()
/**
 * Sitemap 生成工具
 * 用于生成网站地图数据
 */

import { getBlogs, getProjects } from "@/api/index";

export class SitemapGenerator {
  constructor(baseUrl = "https://syntaxseed.com") {
    this.baseUrl = baseUrl;
  }

  /**
   * 生成完整的 sitemap 数据
   */
  async generateSitemap() {
    const staticPages = this.getStaticPages();
    const blogPages = await this.getBlogPages();
    const projectPages = await this.getProjectPages();

    return [...staticPages, ...blogPages, ...projectPages];
  }

  /**
   * 获取静态页面
   */
  getStaticPages() {
    return [
      {
        url: this.baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: "1.0",
      },
      {
        url: `${this.baseUrl}/blog`,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: "0.9",
      },
      {
        url: `${this.baseUrl}/projects`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.8",
      },
      {
        url: `${this.baseUrl}/timeline`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: "0.7",
      },
      {
        url: `${this.baseUrl}/tech-stack`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: "0.7",
      },
    ];
  }

  /**
   * 获取博客页面
   */
  async getBlogPages() {
    try {
      const response = await getBlogs({ page: 1, limit: 1000 });
      return response.data.map((blog) => ({
        url: `${this.baseUrl}/blog/${blog.id}`,
        lastmod: new Date(blog.create_time * 1000).toISOString(),
        changefreq: "weekly",
        priority: "0.8",
      }));
    } catch (error) {
      console.error("获取博客页面失败:", error);
      return [];
    }
  }

  /**
   * 获取项目页面
   */
  async getProjectPages() {
    try {
      const response = await getProjects({ page: 1, limit: 1000 });
      return response.data.map((project) => ({
        url: `${this.baseUrl}/projects/${project.id}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: "0.7",
      }));
    } catch (error) {
      console.error("获取项目页面失败:", error);
      return [];
    }
  }

  /**
   * 生成 XML 格式的 sitemap
   */
  async generateXMLSitemap() {
    const pages = await this.generateSitemap();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    pages.forEach((page) => {
      xml += "  <url>\n";
      xml += `    <loc>${page.url}</loc>\n`;
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += "  </url>\n";
    });

    xml += "</urlset>";

    return xml;
  }

  /**
   * 生成 robots.txt 内容
   */
  generateRobotsTxt() {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# 禁止访问的路径
Disallow: /api/
Disallow: /*.json$
Disallow: /node_modules/

# 爬虫延迟（可选）
Crawl-delay: 1`;
  }
}

export const sitemapGenerator = new SitemapGenerator();

/**
 * SEO 工具类
 * 用于管理页面的 meta 标签、结构化数据等 SEO 相关功能
 */

export class SEOManager {
  constructor() {
    this.defaultMeta = {
      title: "SyntaxSeed - 开发者成长日志",
      description:
        "记录前端开发学习历程，分享技术心得与项目经验。专注于 Vue.js、React、TypeScript 等现代前端技术栈。",
      keywords:
        "前端开发,Vue.js,React,TypeScript,JavaScript,技术博客,开发者,编程学习",
      author: "SyntaxSeed",
      image: "/logo.svg",
      url: window.location.origin,
      type: "website",
      siteName: "SyntaxSeed",
    };
  }

  /**
   * 设置页面 meta 标签
   * @param {Object} meta - meta 信息对象
   */
  setMeta(meta = {}) {
    const finalMeta = { ...this.defaultMeta, ...meta };

    // 设置页面标题
    document.title = finalMeta.title;

    // 设置基础 meta 标签
    this.setMetaTag("description", finalMeta.description);
    this.setMetaTag("keywords", finalMeta.keywords);
    this.setMetaTag("author", finalMeta.author);

    // 设置 Open Graph 标签
    this.setMetaProperty("og:title", finalMeta.title);
    this.setMetaProperty("og:description", finalMeta.description);
    this.setMetaProperty("og:image", this.getFullUrl(finalMeta.image));
    this.setMetaProperty("og:url", finalMeta.url);
    this.setMetaProperty("og:type", finalMeta.type);
    this.setMetaProperty("og:site_name", finalMeta.siteName);

    // 设置 Twitter Card 标签
    this.setMetaName("twitter:card", "summary_large_image");
    this.setMetaName("twitter:title", finalMeta.title);
    this.setMetaName("twitter:description", finalMeta.description);
    this.setMetaName("twitter:image", this.getFullUrl(finalMeta.image));

    // 设置其他重要的 meta 标签
    this.setMetaName("robots", "index,follow");
    this.setMetaName("googlebot", "index,follow");
    this.setMetaName("viewport", "width=device-width, initial-scale=1.0");
    this.setMetaName("theme-color", "#2a9d8f");

    // 设置 canonical 链接
    this.setCanonical(finalMeta.url);
  }

  /**
   * 设置 meta name 标签
   */
  setMetaName(name, content) {
    this.updateOrCreateMeta(`meta[name="${name}"]`, "name", name, content);
  }

  /**
   * 设置 meta property 标签
   */
  setMetaProperty(property, content) {
    this.updateOrCreateMeta(
      `meta[property="${property}"]`,
      "property",
      property,
      content,
    );
  }

  /**
   * 设置普通 meta 标签
   */
  setMetaTag(name, content) {
    this.updateOrCreateMeta(`meta[name="${name}"]`, "name", name, content);
  }

  /**
   * 更新或创建 meta 标签
   */
  updateOrCreateMeta(selector, attribute, value, content) {
    let meta = document.querySelector(selector);
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, value);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  }

  /**
   * 设置 canonical 链接
   */
  setCanonical(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", url);
    } else {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("href", url);
      document.head.appendChild(canonical);
    }
  }

  /**
   * 获取完整 URL
   */
  getFullUrl(path) {
    if (path.startsWith("http")) {
      return path;
    }
    return window.location.origin + (path.startsWith("/") ? path : "/" + path);
  }

  /**
   * 生成博客文章的结构化数据
   */
  generateBlogPostSchema(article) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.excerpt || article.title,
      image: article.image
        ? this.getFullUrl(article.image)
        : this.getFullUrl("/logo.svg"),
      author: {
        "@type": "Person",
        name: this.defaultMeta.author,
        url: window.location.origin,
      },
      publisher: {
        "@type": "Organization",
        name: this.defaultMeta.siteName,
        logo: {
          "@type": "ImageObject",
          url: this.getFullUrl("/logo.svg"),
        },
      },
      datePublished: new Date(article.create_time * 1000).toISOString(),
      dateModified: new Date(article.create_time * 1000).toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${window.location.origin}/blog/${article.id}`,
      },
      keywords: article.tags ? article.tags.join(", ") : "",
      wordCount: article.content ? article.content.length : 0,
      timeRequired: `PT${article.readTime || 5}M`,
    };

    this.setStructuredData("blog-post", schema);
  }

  /**
   * 生成网站的结构化数据
   */
  generateWebsiteSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: this.defaultMeta.siteName,
      description: this.defaultMeta.description,
      url: window.location.origin,
      author: {
        "@type": "Person",
        name: this.defaultMeta.author,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${window.location.origin}/blog?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };

    this.setStructuredData("website", schema);
  }

  /**
   * 生成个人资料的结构化数据
   */
  generatePersonSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: this.defaultMeta.author,
      url: window.location.origin,
      description: "前端开发者，专注于现代 Web 技术",
      jobTitle: "前端开发工程师",
      knowsAbout: [
        "JavaScript",
        "Vue.js",
        "React",
        "TypeScript",
        "Node.js",
        "前端开发",
      ],
      sameAs: [
        // 这里可以添加社交媒体链接
      ],
    };

    this.setStructuredData("person", schema);
  }

  /**
   * 设置结构化数据
   */
  setStructuredData(id, schema) {
    let script = document.querySelector(`script[data-schema="${id}"]`);
    if (script) {
      script.textContent = JSON.stringify(schema);
    } else {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-schema", id);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }

  /**
   * 生成面包屑导航的结构化数据
   */
  generateBreadcrumbSchema(breadcrumbs) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    this.setStructuredData("breadcrumb", schema);
  }

  /**
   * 预加载关键资源
   */
  preloadResources(resources) {
    resources.forEach((resource) => {
      // 检查是否已经存在相同的预加载链接
      const existingLink = document.querySelector(
        `link[rel="preload"][href="${resource.href}"]`,
      );
      if (existingLink) {
        return; // 如果已存在，跳过
      }

      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;

      // 添加错误处理，避免预加载失败的警告
      link.onerror = () => {
        console.warn(`预加载资源失败: ${resource.href}`);
      };

      document.head.appendChild(link);
    });
  }

  /**
   * 设置 DNS 预解析
   */
  setDNSPrefetch(domains) {
    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  /**
   * 生成 sitemap 数据
   */
  generateSitemapData(pages) {
    return pages.map((page) => ({
      url: this.getFullUrl(page.path),
      lastmod: page.lastmod || new Date().toISOString(),
      changefreq: page.changefreq || "weekly",
      priority: page.priority || "0.8",
    }));
  }
}

// 创建全局 SEO 管理器实例
export const seoManager = new SEOManager();

// 页面特定的 SEO 配置
export const pageSEOConfig = {
  home: {
    title: "SyntaxSeed - 开发者成长日志 | 前端技术分享",
    description:
      "欢迎来到 SyntaxSeed！记录前端开发学习历程，分享 Vue.js、React、TypeScript 等技术心得与项目经验。",
    keywords:
      "前端开发,Vue.js,React,TypeScript,JavaScript,技术博客,开发者成长,编程学习",
    type: "website",
  },
  blog: {
    title: "技术博客 - SyntaxSeed",
    description:
      "分享前端开发技术文章，包括 Vue.js、React、TypeScript、JavaScript 等现代前端技术栈的学习心得和实践经验。",
    keywords:
      "技术博客,前端文章,Vue.js教程,React教程,TypeScript,JavaScript,编程技巧",
    type: "website",
  },
  projects: {
    title: "项目展示 - SyntaxSeed",
    description:
      "展示个人前端项目作品，包括 Vue.js、React 等技术栈开发的 Web 应用和组件库。",
    keywords: "前端项目,Vue.js项目,React项目,开源项目,Web应用,项目展示",
    type: "website",
  },
  timeline: {
    title: "成长时间线 - SyntaxSeed",
    description: "记录个人技术成长历程，展示学习路径和技能发展轨迹。",
    keywords: "技术成长,学习历程,开发者成长,技能发展,编程学习路径",
    type: "website",
  },
  techStack: {
    title: "技术栈 - SyntaxSeed",
    description:
      "展示掌握的前端技术栈，包括 Vue.js、React、TypeScript、Node.js 等技术的熟练程度。",
    keywords: "技术栈,前端技能,Vue.js,React,TypeScript,Node.js,技术能力",
    type: "website",
  },
};

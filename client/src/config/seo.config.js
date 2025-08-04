/**
 * SEO 配置文件
 * 集中管理所有 SEO 相关的配置
 */

export const seoConfig = {
  // 网站基本信息
  site: {
    name: "SyntaxSeed",
    title: "SyntaxSeed - 开发者成长日志",
    description:
      "记录前端开发学习历程，分享技术心得与项目经验。专注于 Vue.js、React、TypeScript 等现代前端技术栈。",
    url: "https://syntaxseed.com",
    logo: "/logo.svg",
    author: "SyntaxSeed",
    language: "zh-CN",
    locale: "zh_CN",
  },

  // 默认 meta 标签
  defaultMeta: {
    keywords:
      "前端开发,Vue.js,React,TypeScript,JavaScript,技术博客,开发者,编程学习",
    robots: "index,follow",
    googlebot: "index,follow",
    themeColor: "#2a9d8f",
    msapplicationTileColor: "#2a9d8f",
  },

  // 社交媒体配置
  social: {
    twitter: {
      card: "summary_large_image",
      site: "@syntaxseed",
      creator: "@syntaxseed",
    },
    facebook: {
      appId: "", // 如果有 Facebook App ID
    },
  },

  // 结构化数据配置
  structuredData: {
    organization: {
      "@type": "Organization",
      name: "SyntaxSeed",
      url: "https://syntaxseed.com",
      logo: "https://syntaxseed.com/logo.svg",
      sameAs: [
        // 社交媒体链接
      ],
    },
    person: {
      "@type": "Person",
      name: "SyntaxSeed",
      url: "https://syntaxseed.com",
      jobTitle: "前端开发工程师",
      description: "专注于现代前端技术的开发者",
      knowsAbout: [
        "JavaScript",
        "TypeScript",
        "Vue.js",
        "React",
        "Node.js",
        "前端开发",
        "Web开发",
      ],
    },
  },

  // 页面特定配置
  pages: {
    home: {
      title: "SyntaxSeed - 开发者成长日志 | 前端技术分享",
      description:
        "欢迎来到 SyntaxSeed！记录前端开发学习历程，分享 Vue.js、React、TypeScript 等技术心得与项目经验。",
      keywords:
        "前端开发,Vue.js,React,TypeScript,JavaScript,技术博客,开发者成长,编程学习",
      type: "website",
      priority: "1.0",
      changefreq: "daily",
    },
    blog: {
      title: "技术博客 - SyntaxSeed",
      description:
        "分享前端开发技术文章，包括 Vue.js、React、TypeScript、JavaScript 等现代前端技术栈的学习心得和实践经验。",
      keywords:
        "技术博客,前端文章,Vue.js教程,React教程,TypeScript,JavaScript,编程技巧",
      type: "website",
      priority: "0.9",
      changefreq: "daily",
    },
    projects: {
      title: "项目展示 - SyntaxSeed",
      description:
        "展示个人前端项目作品，包括 Vue.js、React 等技术栈开发的 Web 应用和组件库。",
      keywords: "前端项目,Vue.js项目,React项目,开源项目,Web应用,项目展示",
      type: "website",
      priority: "0.8",
      changefreq: "weekly",
    },
    timeline: {
      title: "成长时间线 - SyntaxSeed",
      description: "记录个人技术成长历程，展示学习路径和技能发展轨迹。",
      keywords: "技术成长,学习历程,开发者成长,技能发展,编程学习路径",
      type: "website",
      priority: "0.7",
      changefreq: "monthly",
    },
    techStack: {
      title: "技术栈 - SyntaxSeed",
      description:
        "展示掌握的前端技术栈，包括 Vue.js、React、TypeScript、Node.js 等技术的熟练程度。",
      keywords: "技术栈,前端技能,Vue.js,React,TypeScript,Node.js,技术能力",
      type: "website",
      priority: "0.7",
      changefreq: "monthly",
    },
  },

  // 性能优化配置
  performance: {
    // DNS 预解析域名
    dnsPrefetch: [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://www.google-analytics.com",
    ],

    // 预连接域名
    preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],

    // 预加载资源
    preload: [
      {
        href: "/logo.svg",
        as: "image",
        type: "image/svg+xml",
      },
    ],
  },

  // 分析工具配置
  analytics: {
    // Google Analytics
    googleAnalytics: {
      measurementId: "", // GA4 测量 ID
      enabled: false,
    },

    // 百度统计
    baiduAnalytics: {
      siteId: "", // 百度统计站点 ID
      enabled: false,
    },

    // Google Search Console
    googleSearchConsole: {
      verificationCode: "", // 验证代码
      enabled: false,
    },
  },

  // 搜索引擎优化配置
  searchEngines: {
    // 提交 sitemap 的搜索引擎
    submitSitemap: [
      "https://www.google.com/ping?sitemap=",
      "https://www.bing.com/ping?sitemap=",
      "https://ziyuan.baidu.com/linksubmit/url",
    ],

    // robots.txt 配置
    robots: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/*.json$", "/node_modules/", "/src/", "/dist/"],
      crawlDelay: 1,
      sitemap: "https://syntaxseed.com/sitemap.xml",
    },
  },

  // 内容优化配置
  content: {
    // 标题长度限制
    title: {
      min: 30,
      max: 60,
    },

    // 描述长度限制
    description: {
      min: 120,
      max: 160,
    },

    // 关键词数量限制
    keywords: {
      max: 10,
    },

    // 文章阅读时间计算（每分钟阅读字数）
    readingSpeed: 200,
  },
};

export default seoConfig;

/**
 * SEO 检查工具
 * 用于检查页面的 SEO 优化情况
 */

export class SEOChecker {
  constructor() {
    this.checks = [];
  }

  /**
   * 执行所有 SEO 检查
   */
  runAllChecks() {
    this.checks = [];

    this.checkTitle();
    this.checkDescription();
    this.checkHeadings();
    this.checkImages();
    this.checkLinks();
    this.checkMeta();
    this.checkStructuredData();
    this.checkPerformance();

    return this.getReport();
  }

  /**
   * 检查页面标题
   */
  checkTitle() {
    const title = document.title;
    const check = {
      name: "页面标题",
      status: "pass",
      message: "",
      suggestions: [],
    };

    if (!title) {
      check.status = "fail";
      check.message = "缺少页面标题";
      check.suggestions.push("添加页面标题");
    } else if (title.length < 30) {
      check.status = "warning";
      check.message = `标题过短 (${title.length} 字符)`;
      check.suggestions.push("标题建议在 30-60 字符之间");
    } else if (title.length > 60) {
      check.status = "warning";
      check.message = `标题过长 (${title.length} 字符)`;
      check.suggestions.push("标题建议在 30-60 字符之间");
    } else {
      check.message = `标题长度合适 (${title.length} 字符)`;
    }

    this.checks.push(check);
  }

  /**
   * 检查页面描述
   */
  checkDescription() {
    const description = document.querySelector(
      'meta[name="description"]',
    )?.content;
    const check = {
      name: "页面描述",
      status: "pass",
      message: "",
      suggestions: [],
    };

    if (!description) {
      check.status = "fail";
      check.message = "缺少页面描述";
      check.suggestions.push("添加 meta description");
    } else if (description.length < 120) {
      check.status = "warning";
      check.message = `描述过短 (${description.length} 字符)`;
      check.suggestions.push("描述建议在 120-160 字符之间");
    } else if (description.length > 160) {
      check.status = "warning";
      check.message = `描述过长 (${description.length} 字符)`;
      check.suggestions.push("描述建议在 120-160 字符之间");
    } else {
      check.message = `描述长度合适 (${description.length} 字符)`;
    }

    this.checks.push(check);
  }

  /**
   * 检查标题层级
   */
  checkHeadings() {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const h1Count = document.querySelectorAll("h1").length;

    const check = {
      name: "标题结构",
      status: "pass",
      message: "",
      suggestions: [],
    };

    if (h1Count === 0) {
      check.status = "fail";
      check.message = "缺少 H1 标题";
      check.suggestions.push("每个页面应该有一个 H1 标题");
    } else if (h1Count > 1) {
      check.status = "warning";
      check.message = `发现 ${h1Count} 个 H1 标题`;
      check.suggestions.push("每个页面应该只有一个 H1 标题");
    } else {
      check.message = `标题结构良好，共 ${headings.length} 个标题`;
    }

    this.checks.push(check);
  }

  /**
   * 检查图片优化
   */
  checkImages() {
    const images = document.querySelectorAll("img");
    const imagesWithoutAlt = Array.from(images).filter((img) => !img.alt);

    const check = {
      name: "图片优化",
      status: "pass",
      message: "",
      suggestions: [],
    };

    if (imagesWithoutAlt.length > 0) {
      check.status = "warning";
      check.message = `${imagesWithoutAlt.length} 张图片缺少 alt 属性`;
      check.suggestions.push("为所有图片添加描述性的 alt 属性");
    } else if (images.length > 0) {
      check.message = `所有 ${images.length} 张图片都有 alt 属性`;
    } else {
      check.message = "页面没有图片";
    }

    this.checks.push(check);
  }

  /**
   * 检查链接
   */
  checkLinks() {
    const links = document.querySelectorAll("a");
    const externalLinks = Array.from(links).filter(
      (link) =>
        link.href &&
        !link.href.startsWith(window.location.origin) &&
        !link.hasAttribute("rel"),
    );

    const check = {
      name: "链接优化",
      status: "pass",
      message: "",
      suggestions: [],
    };

    if (externalLinks.length > 0) {
      check.status = "warning";
      check.message = `${externalLinks.length} 个外部链接缺少 rel 属性`;
      check.suggestions.push('为外部链接添加 rel="noopener noreferrer"');
    } else {
      check.message = "链接配置良好";
    }

    this.checks.push(check);
  }

  /**
   * 检查 Meta 标签
   */
  checkMeta() {
    const requiredMeta = ["viewport", "robots", "author"];

    const missingMeta = requiredMeta.filter(
      (name) => !document.querySelector(`meta[name="${name}"]`),
    );

    const check = {
      name: "Meta 标签",
      status: "pass",
      message: "",
      suggestions: [],
    };

    if (missingMeta.length > 0) {
      check.status = "warning";
      check.message = `缺少 ${missingMeta.join(", ")} meta 标签`;
      check.suggestions.push("添加缺少的 meta 标签");
    } else {
      check.message = "基础 meta 标签完整";
    }

    // 检查 Open Graph 标签
    const ogTags = ["og:title", "og:description", "og:image", "og:url"];
    const missingOG = ogTags.filter(
      (property) => !document.querySelector(`meta[property="${property}"]`),
    );

    if (missingOG.length > 0) {
      check.status = "warning";
      check.message += ` | 缺少 ${missingOG.join(", ")} Open Graph 标签`;
      check.suggestions.push("添加 Open Graph 标签以优化社交媒体分享");
    }

    this.checks.push(check);
  }

  /**
   * 检查结构化数据
   */
  checkStructuredData() {
    const structuredData = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );

    const check = {
      name: "结构化数据",
      status: "pass",
      message: "",
      suggestions: [],
    };

    if (structuredData.length === 0) {
      check.status = "warning";
      check.message = "缺少结构化数据";
      check.suggestions.push("添加 JSON-LD 结构化数据以提高搜索引擎理解");
    } else {
      check.message = `发现 ${structuredData.length} 个结构化数据`;
    }

    this.checks.push(check);
  }

  /**
   * 检查性能相关的 SEO 因素
   */
  checkPerformance() {
    const check = {
      name: "性能优化",
      status: "pass",
      message: "",
      suggestions: [],
    };

    // 检查是否有预加载资源
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
    const dnsPrefetch = document.querySelectorAll('link[rel="dns-prefetch"]');

    const optimizations = [];
    if (preloadLinks.length > 0)
      optimizations.push(`${preloadLinks.length} 个预加载资源`);
    if (prefetchLinks.length > 0)
      optimizations.push(`${prefetchLinks.length} 个预获取资源`);
    if (dnsPrefetch.length > 0)
      optimizations.push(`${dnsPrefetch.length} 个 DNS 预解析`);

    if (optimizations.length > 0) {
      check.message = `性能优化: ${optimizations.join(", ")}`;
    } else {
      check.status = "warning";
      check.message = "缺少性能优化";
      check.suggestions.push("添加资源预加载、DNS 预解析等性能优化");
    }

    this.checks.push(check);
  }

  /**
   * 生成检查报告
   */
  getReport() {
    const passed = this.checks.filter(
      (check) => check.status === "pass",
    ).length;
    const warnings = this.checks.filter(
      (check) => check.status === "warning",
    ).length;
    const failed = this.checks.filter(
      (check) => check.status === "fail",
    ).length;

    return {
      summary: {
        total: this.checks.length,
        passed,
        warnings,
        failed,
        score: Math.round((passed / this.checks.length) * 100),
      },
      checks: this.checks,
      suggestions: this.getAllSuggestions(),
    };
  }

  /**
   * 获取所有建议
   */
  getAllSuggestions() {
    const suggestions = [];
    this.checks.forEach((check) => {
      suggestions.push(...check.suggestions);
    });
    return [...new Set(suggestions)]; // 去重
  }

  /**
   * 在控制台输出报告
   */
  logReport() {
    const report = this.getReport();

    console.group("🔍 SEO 检查报告");
    console.log(`📊 总分: ${report.summary.score}/100`);
    console.log(`✅ 通过: ${report.summary.passed}`);
    console.log(`⚠️ 警告: ${report.summary.warnings}`);
    console.log(`❌ 失败: ${report.summary.failed}`);

    console.group("📋 详细检查结果");
    report.checks.forEach((check) => {
      const icon =
        check.status === "pass"
          ? "✅"
          : check.status === "warning"
            ? "⚠️"
            : "❌";
      console.log(`${icon} ${check.name}: ${check.message}`);
      if (check.suggestions.length > 0) {
        console.log(`   💡 建议: ${check.suggestions.join(", ")}`);
      }
    });
    console.groupEnd();

    if (report.suggestions.length > 0) {
      console.group("💡 优化建议");
      report.suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
      });
      console.groupEnd();
    }

    console.groupEnd();

    return report;
  }
}

export const seoChecker = new SEOChecker();

// 开发环境下自动运行 SEO 检查
if (process.env.NODE_ENV === "development") {
  // 页面加载完成后延迟检查
  window.addEventListener("load", () => {
    setTimeout(() => {
      seoChecker.logReport();
    }, 2000);
  });
}

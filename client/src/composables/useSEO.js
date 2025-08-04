/**
 * SEO Composable
 * Vue 3 组合式 API 的 SEO 工具
 */

import { onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { seoManager, pageSEOConfig } from "@/utils/seo";

export function useSEO(customMeta = {}) {
  const route = useRoute();

  // 设置页面 SEO
  const setSEO = (meta = {}) => {
    const routeName = route.name;
    const defaultMeta = pageSEOConfig[routeName] || {};
    const finalMeta = {
      ...defaultMeta,
      ...customMeta,
      ...meta,
      url: window.location.href,
    };

    seoManager.setMeta(finalMeta);
  };

  // 设置博客文章 SEO
  const setBlogSEO = (article) => {
    const meta = {
      title: `${article.title} - SyntaxSeed`,
      description: article.excerpt || article.title,
      keywords: article.tags
        ? article.tags.join(",") + ",前端开发,技术博客"
        : "前端开发,技术博客",
      image: article.image,
      type: "article",
      url: `${window.location.origin}/blog/${article.id}`,
    };

    setSEO(meta);
    seoManager.generateBlogPostSchema(article);

    // 生成面包屑导航
    const breadcrumbs = [
      { name: "首页", url: window.location.origin },
      { name: "博客", url: `${window.location.origin}/blog` },
      {
        name: article.title,
        url: `${window.location.origin}/blog/${article.id}`,
      },
    ];
    seoManager.generateBreadcrumbSchema(breadcrumbs);
  };

  // 设置项目页面 SEO
  const setProjectSEO = (project) => {
    const meta = {
      title: `${project.title} - 项目展示 - SyntaxSeed`,
      description: project.description || project.title,
      keywords: project.technologies
        ? project.technologies.join(",") + ",前端项目,开源项目"
        : "前端项目,开源项目",
      image: project.image,
      type: "website",
      url: `${window.location.origin}/projects/${project.id}`,
    };

    setSEO(meta);
  };

  // 监听路由变化
  watch(
    () => route.fullPath,
    () => {
      setSEO();
    },
    { immediate: true },
  );

  onMounted(() => {
    // 设置网站基础结构化数据
    seoManager.generateWebsiteSchema();
    seoManager.generatePersonSchema();

    // 设置 DNS 预解析
    seoManager.setDNSPrefetch([
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ]);

    // 不预加载 logo.svg，因为它已经作为 favicon 被浏览器自动加载
    // 字体也已经在 index.html 中通过 link 标签加载，无需重复预加载
  });

  return {
    setSEO,
    setBlogSEO,
    setProjectSEO,
    seoManager,
  };
}

// 专门用于博客详情页的 SEO hook
export function useBlogSEO() {
  const { setBlogSEO } = useSEO();

  return {
    setBlogSEO,
  };
}

// 专门用于项目页面的 SEO hook
export function useProjectSEO() {
  const { setProjectSEO } = useSEO();

  return {
    setProjectSEO,
  };
}

<template>
  <header class="article-header mb-8">
    <!-- 封面图片 -->
    <div
      v-if="blog.image"
      class="cover-image-container relative mb-8 rounded-2xl overflow-hidden shadow-2xl"
    >
      <img
        :src="getImageUrl(blog.image)"
        :alt="blog.title"
        class="w-full h-64 md:h-96 object-cover transition-transform duration-700 hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
      ></div>
      <!-- 科技感装饰元素 -->
      <div
        class="absolute top-4 right-4 w-16 h-16 border border-white/20 rounded-full backdrop-blur-sm bg-white/10"
      >
        <div
          class="absolute inset-2 border border-white/10 rounded-full animate-pulse"
        ></div>
      </div>
      <div
        class="absolute bottom-4 left-4 w-8 h-8 border border-white/30 rounded-sm backdrop-blur-sm bg-white/10"
      >
        <div class="absolute inset-1 border border-white/20 rounded-sm"></div>
      </div>
      <!-- 网格装饰 -->
      <div class="absolute inset-0 opacity-10">
        <div class="grid-pattern"></div>
      </div>
    </div>

    <!-- 文章标题 -->
    <h1
      class="article-title text-3xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white leading-tight"
    >
      <span
        class="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent"
      >
        {{ blog.title }}
      </span>
    </h1>

    <!-- 文章元信息 -->
    <div
      class="article-meta flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6"
    >
      <span class="meta-item flex items-center">
        <i class="pi pi-calendar mr-2 text-primary dark:text-code-accent"></i>
        {{ formatDate(blog.create_time) }}
      </span>
      <span class="meta-item flex items-center">
        <i class="pi pi-clock mr-2 text-primary dark:text-code-accent"></i>
        {{ blog.readTime }} 分钟阅读
      </span>
      <span v-if="blog.views !== undefined" class="meta-item flex items-center">
        <i class="pi pi-eye mr-2 text-primary dark:text-code-accent"></i>
        {{ formatViews(blog.views) }} 次阅读
      </span>
    </div>

    <!-- 标签 -->
    <div
      v-if="blog.tags && blog.tags.length > 0"
      class="article-tags flex flex-wrap gap-2 mb-6"
    >
      <span v-for="tag in blog.tags" :key="tag" class="tech-badge">
        <i class="pi pi-tag mr-1 text-xs"></i>
        {{ tag }}
      </span>
    </div>

    <!-- 摘要 -->
    <div v-if="blog.excerpt" class="article-excerpt">
      <div class="excerpt-container">
        <div class="excerpt-icon">
          <i class="pi pi-info-circle text-primary dark:text-code-accent"></i>
        </div>
        <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ blog.excerpt }}
        </p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";

// 定义props
interface BlogDetail {
  id: number | string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  readTime: number;
  create_time: number;
  views?: number;
}

interface Props {
  blog: BlogDetail;
  baseUrl: string;
}

const props = defineProps<Props>();

// 格式化日期
const formatDate = (timestamp: number) => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (err) {
    console.error("日期格式化失败:", err);
    return "日期未知";
  }
};

// 格式化阅读量
const formatViews = (views: number) => {
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + "w";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "k";
  }
  return views.toString();
};

// 获取图片URL
const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return "";
  return imageUrl.startsWith("http") ? imageUrl : props.baseUrl + imageUrl;
};

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  console.warn("图片加载失败:", img.src);
  // 可以设置默认图片或隐藏图片容器
  img.style.display = "none";
};
</script>

<style lang="scss" scoped>
/* 封面图片容器 */
.cover-image-container {
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(42, 157, 143, 0.1) 0%,
      rgba(100, 255, 218, 0.05) 50%,
      rgba(42, 157, 143, 0.1) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  img {
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.05);
  }
}

/* 网格装饰图案 */
.grid-pattern {
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(20px, 20px);
  }
}

/* 文章标题 */
.article-title {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--color-accent-teal) 0%,
      var(--color-accent-cyan) 100%
    );
    border-radius: 2px;
  }
}

/* 元信息样式 */
.article-meta {
  .meta-item {
    position: relative;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dark & {
      background: rgba(31, 41, 55, 0.8);
      border-color: rgba(75, 85, 99, 0.3);

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    }
  }
}

/* 技术标签 */
.tech-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: linear-gradient(
    135deg,
    rgba(42, 157, 143, 0.2) 0%,
    rgba(42, 157, 143, 0.1) 100%
  );
  color: var(--color-accent-teal);
  border: 1px solid rgba(42, 157, 143, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px rgba(42, 157, 143, 0.3);

    &::before {
      left: 100%;
    }
  }

  .dark & {
    background: linear-gradient(
      135deg,
      rgba(100, 255, 218, 0.2) 0%,
      rgba(100, 255, 218, 0.1) 100%
    );
    color: var(--color-accent-cyan);
    border-color: rgba(100, 255, 218, 0.2);

    &:hover {
      box-shadow: 0 4px 12px rgba(100, 255, 218, 0.3);
    }
  }
}

/* 摘要容器 */
.excerpt-container {
  position: relative;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(42, 157, 143, 0.05) 0%,
    rgba(100, 255, 218, 0.05) 100%
  );
  border: 1px solid rgba(42, 157, 143, 0.1);
  backdrop-filter: blur(10px);

  .dark & {
    background: linear-gradient(
      135deg,
      rgba(100, 255, 218, 0.1) 0%,
      rgba(42, 157, 143, 0.1) 100%
    );
    border-color: rgba(100, 255, 218, 0.2);
  }
}

.excerpt-icon {
  position: absolute;
  top: -12px;
  left: 24px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .dark & {
    background: var(--color-primary-dark);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cover-image-container {
    margin-bottom: 1.5rem;
    border-radius: 1rem;

    img {
      height: 200px;
    }

    .absolute.top-4.right-4 {
      width: 12px;
      height: 12px;
      top: 1rem;
      right: 1rem;
    }

    .absolute.bottom-4.left-4 {
      width: 6px;
      height: 6px;
      bottom: 1rem;
      left: 1rem;
    }
  }

  .article-title {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .article-meta {
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;

    .meta-item {
      padding: 6px 12px;
      font-size: 0.75rem;
      width: fit-content;
    }
  }

  .article-tags {
    gap: 6px;
    margin-bottom: 1rem;
  }

  .tech-badge {
    padding: 6px 12px;
    font-size: 0.7rem;
  }

  .excerpt-container {
    padding: 16px;

    p {
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  .excerpt-icon {
    top: -10px;
    left: 16px;
    width: 20px;
    height: 20px;
  }
}

/* 平板设备优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .cover-image-container img {
    height: 320px;
  }

  .article-title {
    font-size: 3rem;
  }

  .article-meta {
    gap: 12px;
  }
}

/* 科技感动画效果 */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(100, 255, 218, 0.3);
  }

  50% {
    box-shadow:
      0 0 20px rgba(100, 255, 218, 0.6),
      0 0 30px rgba(100, 255, 218, 0.4);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* 装饰元素动画 */
.cover-image-container .absolute.top-4.right-4 {
  animation: float 3s ease-in-out infinite;
}

.cover-image-container .absolute.bottom-4.left-4 {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* 标题发光效果 */
.article-title:hover span {
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
  transition: text-shadow 0.3s ease;
}

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  .cover-image-container img,
  .meta-item,
  .tech-badge {
    transition: none;
  }

  .cover-image-container:hover img,
  .meta-item:hover,
  .tech-badge:hover {
    transform: none;
  }

  .tech-badge::before {
    display: none;
  }

  .grid-pattern,
  .cover-image-container .absolute.top-4.right-4,
  .cover-image-container .absolute.bottom-4.left-4 {
    animation: none;
  }

  .article-title:hover span {
    text-shadow: none;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .tech-badge {
    border-width: 2px;
  }

  .excerpt-container {
    border-width: 2px;
  }

  .article-title::after {
    height: 4px;
  }
}
</style>

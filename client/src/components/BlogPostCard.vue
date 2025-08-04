<template>
  <article
    class="blog-card group h-full flex flex-col rounded-[0.75rem] overflow-hidden"
  >
    <!-- 图片容器 -->
    <div
      class="relative overflow-hidden rounded-t-xl h-48 bg-gradient-to-br from-primary/10 to-code-accent/10"
    >
      <img
        v-if="post.image"
        :src="post.image.startsWith('http') ? post.image : baseUrl + post.image"
        :alt="post.title"
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center"
      >
        <div
          class="text-center transform transition-all duration-500 group-hover:scale-110"
        >
          <i
            class="pi pi-image text-4xl text-gray-400 dark:text-gray-500 mb-2"
          ></i>
          <p class="text-sm text-gray-500 dark:text-gray-400">暂无图片</p>
        </div>
      </div>

      <!-- 悬浮日期标签 -->
      <div
        class="absolute top-3 right-3 transform transition-all duration-300 group-hover:scale-105"
      >
        <div
          class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-white/20 dark:border-gray-700/20"
        >
          <i class="pi pi-calendar mr-1 text-primary dark:text-code-accent"></i>
          {{ formatDate(new Date(post.create_time).getTime()) }}
        </div>
      </div>

      <!-- 悬浮渐变遮罩 -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>
    </div>

    <!-- 内容区域 -->
    <div
      class="p-6 flex-grow flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
    >
      <!-- 标签区域 -->
      <div
        v-if="post.tags && post.tags.length > 0"
        class="flex flex-wrap gap-2 mb-4"
      >
        <span
          v-for="(tag, index) in post.tags.slice(0, 3)"
          :key="tag"
          class="tech-badge-modern"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <i class="pi pi-tag mr-1 text-xs"></i>
          {{ tag }}
        </span>
        <span v-if="post.tags.length > 3" class="tech-badge-more">
          +{{ post.tags.length - 3 }}
        </span>
      </div>

      <!-- 标题 -->
      <h3
        class="text-xl font-bold mb-3 text-gray-800 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-code-accent transition-colors duration-300"
      >
        {{ post.title }}
      </h3>

      <!-- 摘要 -->
      <p
        class="text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3 leading-relaxed"
      >
        {{ post.excerpt || "暂无摘要..." }}
      </p>

      <!-- 底部信息 -->
      <div
        class="flex justify-between items-center mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
      >
        <div
          class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
        >
          <span class="flex items-center">
            <i class="pi pi-clock mr-1 text-primary dark:text-code-accent"></i>
            {{ post.readTime }} 分钟
          </span>
          <span class="flex items-center">
            <i class="pi pi-eye mr-1 text-primary dark:text-code-accent"></i>
            {{ post.views || 0 }}
          </span>
        </div>

        <router-link
          :to="{ name: 'blog-detail', params: { id: post.id } }"
          class="read-more-btn group/btn"
        >
          <span class="relative z-10">阅读全文</span>
          <i
            class="pi pi-arrow-right ml-2 transform transition-transform duration-300 group-hover/btn:translate-x-1"
          ></i>
        </router-link>
      </div>
    </div>
  </article>
</template>

<script>
import useConfig from "../stores/config";

export default {
  name: "BlogPostCard",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const config = useConfig();
    const baseUrl = config.ossBaseUrl;
    const formatDate = (timestamp) => {
      if (!timestamp) return "";
      // 处理时间戳格式（秒级）
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return {
      formatDate,
      baseUrl,
    };
  },
};
</script>

<style scoped>
/* 博客卡片主体样式 */
.blog-card {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl;
  @apply transform transition-all duration-500 hover:-translate-y-2;
  @apply border border-gray-100 dark:border-gray-700/50;
  @apply backdrop-blur-sm;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.blog-card:hover {
  @apply shadow-primary/10 dark:shadow-code-accent/10;
}

/* 现代化标签样式 */
.tech-badge-modern {
  @apply inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium;
  @apply bg-gradient-to-r from-primary/20 to-primary/10 dark:from-code-accent/20 dark:to-code-accent/10;
  @apply text-primary dark:text-code-accent border border-primary/20 dark:border-code-accent/20;
  @apply transition-all duration-300 hover:scale-105 hover:shadow-md;
  @apply backdrop-blur-sm;
  animation: slideInLeft 0.5s ease-out forwards;
  opacity: 0;
  transform: translateX(-10px);
}

.tech-badge-more {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400;
  @apply transition-all duration-300 hover:scale-105;
}

/* 阅读更多按钮 */
.read-more-btn {
  @apply inline-flex items-center px-4 py-2 rounded-full text-sm font-medium;
  @apply bg-gradient-to-r from-primary/10 to-transparent dark:from-code-accent/10;
  @apply text-primary dark:text-code-accent;
  @apply border border-primary/20 dark:border-code-accent/20;
  @apply transition-all duration-300 hover:scale-105 hover:shadow-md;
  @apply hover:bg-primary hover:text-white dark:hover:bg-code-accent dark:hover:text-gray-900;
  @apply backdrop-blur-sm;
}

/* 文本截断 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 动画关键帧 */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式优化 */
@media (max-width: 640px) {
  .blog-card {
    @apply hover:translate-y-0 hover:scale-105;
  }

  .tech-badge-modern {
    @apply px-2 py-1 text-xs;
  }

  .read-more-btn {
    @apply px-3 py-1.5 text-xs;
  }
}

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  .blog-card,
  .tech-badge-modern,
  .read-more-btn {
    @apply transition-none;
    animation: none;
  }

  .blog-card:hover {
    @apply transform-none;
  }
}

/* 暗色模式优化 */
.dark .blog-card {
  @apply bg-gray-800/90 border-gray-700/30;
}

.dark .blog-card:hover {
  @apply shadow-code-accent/20;
}
</style>

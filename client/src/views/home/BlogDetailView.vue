<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 dark:bg-code-accent/5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-code-accent/5 dark:bg-primary/5 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="relative">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center min-h-screen">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">正在加载文章...</p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div
        v-else-if="error"
        class="flex justify-center items-center min-h-screen"
      >
        <div class="error-container text-center">
          <div
            class="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mb-6 mx-auto"
          >
            <i
              class="pi pi-exclamation-triangle text-4xl text-red-500 dark:text-red-400"
            ></i>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
            加载失败
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {{ error }}
          </p>
          <button @click="retryFetch" class="retry-btn">
            <i class="pi pi-refresh mr-2"></i>
            重试
          </button>
        </div>
      </div>

      <!-- 文章内容 -->
      <div
        v-else-if="blog"
        class="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8"
      >
        <!-- 返回按钮 -->
        <div class="max-w-4xl mx-auto mb-4 sm:mb-6">
          <BackToList />
        </div>

        <!-- 文章头部 -->
        <article class="max-w-4xl mx-auto">
          <ArticleHeader :blog="blog" :base-url="baseUrl" />

          <!-- 文章内容 -->
          <ArticleContent :content="blog.content" />

          <!-- 文章导航 -->
          <ArticleNavigation
            :prev-post="blog.prevPost"
            :next-post="blog.nextPost"
          />

          <!-- 评论区域 -->
          <section class="comments-section mt-6 sm:mt-8 lg:mt-12">
            <h2
              class="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-800 dark:text-white"
            >
              评论
            </h2>
            <!-- 评论表单 -->
            <CommentForm
              :blog-id="blog.id"
              :reply-to="replyingTo"
              @submitted="handleCommentSubmitted"
              @cancel-reply="cancelReply"
            />
            <!-- 评论列表 -->
            <CommentList
              ref="commentListRef"
              :blog-id="blog.id"
              :limit="10"
              @reply="handleCommentReply"
            />
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getBlogDetail } from "../../api";
import useConfig from "../../stores/config.ts";
import ArticleHeader from "../../components/ArticleHeader.vue";
import ArticleContent from "../../components/ArticleContent.vue";
import ArticleNavigation from "../../components/ArticleNavigation.vue";
import BackToList from "../../components/BackToList.vue";
import CommentList from "../../components/CommentList.vue";
import CommentForm from "../../components/CommentForm.vue";
import type { Comment } from "../../api/comments.ts";
import { useBlogSEO } from "@/composables/useSEO";
// 定义博客详情数据类型
interface BlogDetail {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  readTime: number;
  create_time: number;
  views?: number;
  prevPost?: {
    id: string | number;
    title: string;
  };
  nextPost?: {
    id: string | number;
    title: string;
  };
}

// 响应式数据
const loading = ref(true);
const error = ref<string | null>(null);
const blog = ref<BlogDetail | null>(null);

// 路由和配置
const route = useRoute();
const router = useRouter();
const config = useConfig();
const { setBlogSEO } = useBlogSEO();

// 计算属性
const baseUrl = computed(() => config.ossBaseUrl);
const blogId = computed(() => route.params.id as string);

// 数据验证函数
const validateBlogData = (data: unknown): BlogDetail => {
  if (!data || typeof data !== "object") {
    throw new Error("文章数据格式错误");
  }

  // 创建一个更精确的类型来替代 any
  const dataObj = data as Record<string, unknown>;

  // 必需字段验证
  if (!dataObj.id || typeof dataObj.id !== "string") {
    throw new Error("文章ID缺失或格式错误");
  }
  if (!dataObj.title || typeof dataObj.title !== "string") {
    throw new Error("文章标题缺失或格式错误");
  }
  if (!dataObj.content || typeof dataObj.content !== "string") {
    throw new Error("文章内容缺失");
  }

  // 辅助函数：验证导航文章格式
  const validateNavPost = (post: unknown) => {
    if (!post || typeof post !== "object") return undefined;
    const postObj = post as Record<string, unknown>;
    if (postObj.id && postObj.title && typeof postObj.title === "string") {
      return {
        id: typeof postObj.id === "string" ? postObj.id : String(postObj.id),
        title: postObj.title,
      };
    }
    return undefined;
  };

  // 返回验证后的数据，设置默认值
  return {
    id: dataObj.id,
    title: dataObj.title,
    excerpt: typeof dataObj.excerpt === "string" ? dataObj.excerpt : "",
    content: dataObj.content,
    image: typeof dataObj.image === "string" ? dataObj.image : "",
    tags: Array.isArray(dataObj.tags) ? dataObj.tags : [],
    readTime: typeof dataObj.readTime === "number" ? dataObj.readTime : 0,
    create_time:
      typeof dataObj.create_time === "number"
        ? dataObj.create_time
        : Date.now() / 1000,
    views: typeof dataObj.views === "number" ? dataObj.views : 0,
    prevPost: validateNavPost(dataObj.prevPost),
    nextPost: validateNavPost(dataObj.nextPost),
  };
};

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

// 获取博客详情
const fetchBlogDetail = async (id?: string) => {
  try {
    loading.value = true;
    error.value = null;

    const articleId = id || blogId.value;
    if (!articleId) {
      throw new Error("文章ID不存在");
    }

    // 验证ID格式（可以是数字或字符串，但不能为空）
    if (typeof articleId === "string" && articleId.trim() === "") {
      throw new Error("文章ID格式错误");
    }

    // 调用API获取文章详情，显示加载状态
    const response = await getBlogDetail(articleId, true);

    // 验证响应数据
    const validatedData = validateBlogData(response);
    blog.value = validatedData;

    // 设置 SEO 信息
    setBlogSEO(validatedData);

    // 记录文章访问（可选，如果需要统计阅读量）
    // await recordArticleView(articleId)
  } catch (err: unknown) {
    console.error("获取博客详情失败:", err);
    handleFetchError(err);
    blog.value = null;
  } finally {
    loading.value = false;
  }
};

// 处理获取错误
const handleFetchError = (err: unknown) => {
  const error_obj = err as {
    response?: { status?: number };
    code?: string;
    message?: string;
    name?: string;
  };

  // 根据错误类型设置不同的错误信息
  if (error_obj.response?.status === 404) {
    error.value = "文章不存在或已被删除";
  } else if (error_obj.response?.status === 403) {
    error.value = "没有权限访问此文章";
  } else if (error_obj.response?.status === 500) {
    error.value = "服务器内部错误，请稍后重试";
  } else if (
    error_obj.code === "NETWORK_ERROR" ||
    error_obj.message?.includes("Network")
  ) {
    error.value = "网络连接失败，请检查网络后重试";
  } else if (
    error_obj.code === "TIMEOUT" ||
    error_obj.message?.includes("timeout")
  ) {
    error.value = "请求超时，请稍后重试";
  } else if (error_obj.name === "AbortError") {
    error.value = "请求被取消";
  } else {
    error.value = error_obj.message || "获取文章失败，请稍后重试";
  }
};

// 更新页面meta信息
const updatePageMeta = (blogData: BlogDetail) => {
  if (typeof document !== "undefined") {
    // 更新页面标题
    document.title = `${blogData.title} - SyntaxSeed`;

    // 更新meta描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        blogData.excerpt || blogData.title,
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = blogData.excerpt || blogData.title;
      document.head.appendChild(meta);
    }

    // 更新Open Graph meta标签
    updateOpenGraphMeta(blogData);
  }
};

// 更新Open Graph meta标签
const updateOpenGraphMeta = (blogData: BlogDetail) => {
  const ogTags = [
    { property: "og:title", content: blogData.title },
    { property: "og:description", content: blogData.excerpt || blogData.title },
    { property: "og:type", content: "article" },
    { property: "og:url", content: window.location.href },
    {
      property: "article:published_time",
      content: new Date(blogData.create_time * 1000).toISOString(),
    },
    { property: "article:author", content: "SyntaxSeed" },
  ];

  // 如果有封面图，添加og:image
  if (blogData.image) {
    const imageUrl = blogData.image.startsWith("http")
      ? blogData.image
      : baseUrl.value + blogData.image;
    ogTags.push({ property: "og:image", content: imageUrl });
  }

  // 添加标签信息
  if (blogData.tags && blogData.tags.length > 0) {
    blogData.tags.forEach((tag) => {
      ogTags.push({ property: "article:tag", content: tag });
    });
  }

  ogTags.forEach(({ property, content }) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  });
};

// 重试函数
const retryFetch = () => {
  fetchBlogDetail();
};

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      // 重置状态
      blog.value = null;
      error.value = null;
      // 获取新文章
      fetchBlogDetail(newId as string);
    }
  },
  { immediate: false },
);

// 监听路由变化，处理浏览器前进后退
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath !== oldPath && route.name === "blog-detail") {
      // 确保页面滚动到顶部
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
);

// 组件挂载时获取数据
onMounted(async () => {
  // 确保配置已初始化
  if (!config.config || Object.keys(config.config).length === 0) {
    try {
      await config.init();
    } catch (err) {
      console.warn("配置初始化失败:", err);
    }
  }

  // 获取文章详情
  fetchBlogDetail();
});

// 评论相关状态
const commentListRef = ref<InstanceType<typeof CommentList> | null>(null);
const replyingTo = ref<Comment | null>(null);

// 处理评论回复
const handleCommentReply = (comment: Comment) => {
  replyingTo.value = comment;

  // 滚动到评论表单
  setTimeout(() => {
    const formElement = document.querySelector(".comment-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
};

// 取消回复
const cancelReply = () => {
  replyingTo.value = null;
};

// 处理评论提交
const handleCommentSubmitted = (success: boolean) => {
  if (success) {
    // 重置回复状态
    replyingTo.value = null;

    // 刷新评论列表
    if (commentListRef.value) {
      commentListRef.value.fetchComments();
    }
  }
};

// 导出供模板使用的函数和数据
defineExpose({
  fetchBlogDetail: retryFetch,
  blog,
  loading,
  error,
});
</script>

<style lang="scss" scoped>
/* 加载动画 */
.loading-container {
  @apply flex flex-col items-center;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-code-accent rounded-full;
  animation: spin 1s linear infinite;
}

/* 错误状态 */
.error-container {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.retry-btn {
  @apply inline-flex items-center px-6 py-3 rounded-full text-sm font-medium;
  @apply bg-gradient-to-r from-primary to-teal-500 dark:from-code-accent dark:to-teal-400;
  @apply text-white shadow-lg;
  @apply transition-all duration-300 hover:scale-105 hover:shadow-xl;
}

/* 样式已移至BackToList组件 */

/* 技术标签 */
.tech-badge {
  @apply inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium;
  @apply bg-gradient-to-r from-primary/20 to-primary/10 dark:from-code-accent/20 dark:to-code-accent/10;
  @apply text-primary dark:text-code-accent border border-primary/20 dark:border-code-accent/20;
  @apply transition-all duration-300 hover:scale-105;
  @apply backdrop-blur-sm;
}

/* 摘要容器 */
.excerpt-container {
  @apply p-6 rounded-xl;
  @apply bg-gradient-to-r from-primary/5 to-code-accent/5 dark:from-code-accent/10 dark:to-primary/10;
  @apply border border-primary/10 dark:border-code-accent/20;
  @apply backdrop-blur-sm;
}

/* 文章内容样式已移至 ArticleContent 组件 */

/* 样式已移至ArticleNavigation组件 */

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 动画关键帧 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .tech-badge {
    @apply px-2 py-1 text-xs;
  }

  .loading-spinner {
    @apply w-10 h-10;
  }

  .error-container {
    @apply px-4;
  }

  .retry-btn {
    @apply px-5 py-2.5 text-sm;
  }
}

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner,
  .error-container,
  .tech-badge {
    animation: none;
    @apply transition-none;
  }

  .tech-badge:hover {
    @apply transform-none scale-100;
  }
}

/* 暗色模式优化 */
.dark .tech-badge {
  @apply bg-gradient-to-r from-code-accent/20 to-code-accent/10;
  @apply border-code-accent/20;
}
</style>

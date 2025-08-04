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

    <div class="relative py-16">
      <div class="container mx-auto px-4">
        <!-- 页面标题区域 -->
        <div class="text-center mb-16">
          <div class="inline-block mb-6">
            <div
              class="w-16 h-16 bg-gradient-to-br from-primary to-code-accent rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg"
            >
              <i class="pi pi-book text-2xl text-white"></i>
            </div>
          </div>
          <h1
            class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-teal-500 to-code-accent bg-clip-text text-transparent animate-gradient"
          >
            技术博客
          </h1>
          <p
            class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            分享我的技术见解、学习心得和项目开发过程中的经验教训
          </p>
          <div class="mt-8 flex justify-center">
            <div
              class="w-24 h-1 bg-gradient-to-r from-primary to-code-accent rounded-full"
            ></div>
          </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="mb-12">
          <div class="max-w-4xl mx-auto">
            <!-- 搜索框 -->
            <div class="relative mb-8">
              <div class="relative max-w-md mx-auto">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索文章标题、内容..."
                  class="search-input w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary dark:focus:border-code-accent transition-all duration-300 shadow-lg"
                />
                <i
                  class="pi pi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
                ></i>
                <div
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i class="pi pi-times"></i>
                </div>
              </div>
            </div>

            <!-- 标签筛选 -->
            <div class="flex flex-wrap justify-center gap-3">
              <button
                @click="selectedTag = null"
                class="tag-filter"
                :class="selectedTag === null ? 'tag-filter-active' : ''"
              >
                <i class="pi pi-list mr-2"></i>
                全部文章
              </button>
              <button
                v-for="(tag, index) in uniqueTags.slice(0, 8)"
                :key="tag"
                @click="selectedTag = tag"
                class="tag-filter"
                :class="selectedTag === tag ? 'tag-filter-active' : ''"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <i class="pi pi-tag mr-1"></i>
                {{ tag }}
              </button>
              <div v-if="uniqueTags.length > 8" class="relative">
                <button class="tag-filter" @click="showAllTags = !showAllTags">
                  <i class="pi pi-ellipsis-h mr-1"></i>
                  更多 ({{ uniqueTags.length - 8 }})
                </button>
                <!-- 展开的标签列表 -->
                <div
                  v-if="showAllTags"
                  class="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10 min-w-48"
                >
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="tag in uniqueTags.slice(8)"
                      :key="tag"
                      @click="
                        selectedTag = tag;
                        showAllTags = false;
                      "
                      class="tag-filter-small"
                      :class="selectedTag === tag ? 'tag-filter-active' : ''"
                    >
                      {{ tag }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div v-if="!isLoading" class="mb-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            <span class="font-semibold text-primary dark:text-code-accent">{{
              totalItems
            }}</span>
            篇文章
            <span v-if="searchQuery || selectedTag" class="ml-2">
              · 筛选结果:
              <span class="font-semibold text-primary dark:text-code-accent">{{
                filteredPosts.length
              }}</span>
              篇
            </span>
          </p>
        </div>

        <!-- 文章列表 -->
        <div
          v-if="filteredPosts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <BlogPostCard
            v-for="(post, index) in filteredPosts"
            :key="post.id"
            :post="post"
            :style="{ animationDelay: `${index * 0.1}s` }"
            class="blog-card-item"
          />
        </div>

        <!-- 无结果提示 -->
        <div v-else class="text-center py-20">
          <div class="empty-state">
            <div
              class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto"
            >
              <i
                class="pi pi-search text-4xl text-gray-400 dark:text-gray-500"
              ></i>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
              未找到相关文章
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              尝试使用不同的搜索词或筛选条件，或者
              <button
                @click="
                  searchQuery = '';
                  selectedTag = null;
                "
                class="text-primary dark:text-code-accent hover:underline font-medium"
              >
                查看全部文章
              </button>
            </p>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="mt-16 flex justify-center">
          <div class="pagination-container">
            <button
              v-if="currentPage > 1"
              @click="currentPage = currentPage - 1"
              class="pagination-btn pagination-nav"
            >
              <i class="pi pi-chevron-left"></i>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              class="pagination-btn"
              :class="currentPage === page ? 'pagination-active' : ''"
            >
              {{ page }}
            </button>

            <button
              v-if="currentPage < totalPages"
              @click="currentPage = currentPage + 1"
              class="pagination-btn pagination-nav"
            >
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import BlogPostCard from "../../components/BlogPostCard.vue";
import { getBlogs, getBlogTags } from "../../api/index.ts";
import { useSEO } from "@/composables/useSEO.js";

export default {
  name: "BlogView",
  components: {
    BlogPostCard,
  },
  setup() {
    const searchQuery = ref("");
    const selectedTag = ref(null);
    const currentPage = ref(1);
    const postsPerPage = ref(6);
    const isLoading = ref(false);
    const allPosts = ref([]);
    const totalItems = ref(0);
    const availableTags = ref([]);
    const showAllTags = ref(false);

    // 使用 SEO
    useSEO();

    // 获取博客文章列表
    const fetchBlogs = async () => {
      isLoading.value = true;
      try {
        const params = {
          page: currentPage.value,
          limit: postsPerPage.value,
          keywords: searchQuery.value,
        };
        const response = await getBlogs(params);
        allPosts.value = response.data.map((post) => ({
          ...post,
          readTime:
            post.readTime || Math.ceil((post.content?.length || 0) / 1000), // 如果没有阅读时间，根据内容长度估算
        }));
        totalItems.value = response.total;
      } catch (error) {
        console.error("获取博客列表失败:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // 获取博客标签
    const fetchTags = async () => {
      try {
        const response = await getBlogTags();
        availableTags.value = response.tags || [];
      } catch (error) {
        console.error("获取博客标签失败:", error);
      }
    };

    // 初始化数据
    onMounted(() => {
      fetchBlogs();
      fetchTags();
    });

    // 监听搜索、标签和页码变化，重新获取数据
    watch([searchQuery, currentPage], () => {
      fetchBlogs();
    });

    // 当选择标签时，重置页码并更新搜索关键词
    watch(selectedTag, (newTag) => {
      currentPage.value = 1;
      if (newTag) {
        searchQuery.value = newTag;
      } else {
        searchQuery.value = "";
      }
    });

    // 根据搜索和标签筛选文章
    const filteredPosts = computed(() => {
      return allPosts.value;
    });

    // 计算总页数
    const totalPages = computed(() => {
      return Math.ceil(totalItems.value / postsPerPage.value);
    });

    // 提取所有唯一标签
    const uniqueTags = computed(() => {
      return availableTags.value;
    });

    // 计算可见的分页按钮
    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const delta = 2;

      let range = [];
      let rangeWithDots = [];

      for (
        let i = Math.max(2, current - delta);
        i <= Math.min(total - 1, current + delta);
        i++
      ) {
        range.push(i);
      }

      if (current - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (current + delta < total - 1) {
        rangeWithDots.push("...", total);
      } else if (total > 1) {
        rangeWithDots.push(total);
      }

      return rangeWithDots.filter(
        (item, index, arr) => arr.indexOf(item) === index,
      );
    });

    return {
      searchQuery,
      selectedTag,
      currentPage,
      filteredPosts,
      uniqueTags,
      totalPages,
      visiblePages,
      isLoading,
      showAllTags,
      totalItems,
    };
  },
};
</script>

<style scoped lang="scss">
/* 搜索输入框样式 */
.search-input {
  @apply transition-all duration-300;
}

.search-input:focus {
  @apply shadow-xl transform scale-105;
}

/* 标签筛选按钮 */
.tag-filter {
  @apply inline-flex items-center px-4 py-2 rounded-full text-sm font-medium;
  @apply bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm;
  @apply text-gray-700 dark:text-gray-300;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-300 hover:scale-105 hover:shadow-md;
  @apply transform hover:-translate-y-1;
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

.tag-filter:hover {
  @apply bg-gray-50 dark:bg-gray-700/80 border-gray-300 dark:border-gray-600;
}

.tag-filter-active {
  @apply bg-gradient-to-r from-primary to-teal-500 dark:from-code-accent dark:to-teal-400;
  @apply text-white border-transparent shadow-lg;
}

.tag-filter-small {
  @apply inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
  @apply transition-all duration-300 hover:scale-105;
}

/* 加载动画 */
.loading-container {
  @apply flex flex-col items-center;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-code-accent rounded-full;
  animation: spin 1s linear infinite;
}

/* 空状态样式 */
.empty-state {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

/* 博客卡片项目 */
.blog-card-item {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

/* 分页样式 */
.pagination-container {
  @apply flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700;
}

.pagination-btn {
  @apply w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium;
  @apply transition-all duration-300 hover:scale-105;
  @apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
}

.pagination-active {
  @apply bg-gradient-to-r from-primary to-teal-500 dark:from-code-accent dark:to-teal-400;
  @apply text-white shadow-md;
}

.pagination-nav {
  @apply hover:bg-primary/10 dark:hover:bg-code-accent/10;
  @apply hover:text-primary dark:hover:text-code-accent;
}

/* 渐变动画 */
@keyframes gradient {
  0%,
  100% {
    background-size: 200% 200%;
    background-position: left center;
  }

  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* 动画关键帧 */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .tag-filter {
    @apply px-3 py-1.5 text-xs;
  }

  .search-input:focus {
    @apply scale-100;
  }

  .pagination-btn {
    @apply w-8 h-8 text-xs;
  }
}

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  .tag-filter,
  .blog-card-item,
  .empty-state,
  .search-input {
    animation: none;
    @apply transition-none;
  }

  .animate-gradient {
    animation: none;
  }

  .tag-filter:hover,
  .pagination-btn:hover {
    @apply transform-none scale-100;
  }
}

/* 暗色模式优化 */
.dark .pagination-container {
  @apply bg-gray-800/90 border-gray-700/50;
}

.dark .tag-filter {
  @apply bg-gray-800/90 border-gray-700/50;
}

.dark .search-input {
  @apply bg-gray-800/90 border-gray-700/50;
}
</style>

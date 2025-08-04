<template>
  <div class="group relative project-card-container">
    <!-- 主卡片 -->
    <div
      class="card-modern h-full overflow-hidden transition-all duration-500 hover:shadow-glow-lg hover:-translate-y-3 rounded-2xl relative"
    >
      <!-- 装饰边框 -->
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-teal-400 to-primary dark:from-code-accent dark:via-teal-300 dark:to-code-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5"
      >
        <div class="w-full h-full rounded-2xl bg-white dark:bg-gray-900"></div>
      </div>

      <!-- 内容容器 -->
      <div
        class="relative z-10 h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl"
      >
        <!-- 项目类型标签 -->
        <div class="absolute top-4 left-4 z-20">
          <span
            class="category-badge"
            :class="{
              'category-frontend': project.category === 'frontend',
              'category-backend': project.category === 'backend',
              'category-fullstack': project.category === 'fullstack',
              'category-tools': project.category === 'tools',
              'category-default': !project.category,
            }"
          >
            {{ getCategoryLabel(project.category) }}
          </span>
        </div>

        <!-- 收藏按钮 -->
        <div class="absolute top-4 right-4 z-20">
          <button
            class="favorite-btn opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"
          >
            <i class="pi pi-heart text-white"></i>
          </button>
        </div>

        <!-- 图片区域 -->
        <div class="relative overflow-hidden h-56 rounded-t-2xl">
          <img
            :src="baseUrl + project.image"
            :alt="project.title"
            class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          <!-- 渐变遮罩 -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>

          <!-- 悬停时显示的操作按钮 -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
          >
            <div class="flex space-x-4">
              <button
                @click="$emit('view-details', project.id)"
                class="action-btn action-btn-primary"
                aria-label="查看项目详情"
              >
                <i class="pi pi-eye"></i>
                <span class="btn-tooltip">查看详情</span>
              </button>
              <a
                v-if="project.repoUrl"
                :href="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn action-btn-secondary"
                aria-label="查看源代码"
              >
                <i class="pi pi-code"></i>
                <span class="btn-tooltip">源代码</span>
              </a>
              <a
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn action-btn-accent"
                aria-label="查看在线演示"
              >
                <i class="pi pi-external-link"></i>
                <span class="btn-tooltip">在线演示</span>
              </a>
            </div>
          </div>

          <!-- 项目状态指示器 -->
          <div class="absolute bottom-4 left-4 flex space-x-2">
            <div
              class="status-indicator status-active"
              v-tooltip="'项目活跃'"
            ></div>
            <div
              class="status-indicator status-updated"
              v-tooltip="'最近更新'"
            ></div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="p-6">
          <!-- 标题和评分 -->
          <div class="flex items-start justify-between mb-3">
            <h3
              class="text-xl font-bold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-code-accent transition-colors flex-1 mr-2"
            >
              {{ project.title }}
            </h3>
            <div class="flex items-center space-x-1 text-yellow-400">
              <i class="pi pi-star-fill text-sm"></i>
              <span class="text-sm font-medium">4.8</span>
            </div>
          </div>

          <!-- 描述 -->
          <p
            class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed"
          >
            {{ project.description }}
          </p>

          <!-- 技术栈标签 -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="(tech, index) in project.technologies?.slice(0, 3)"
              :key="index"
              class="tech-tag"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              {{ tech }}
            </span>
            <span
              v-if="project.technologies?.length > 3"
              class="tech-tag tech-tag-more"
            >
              +{{ project.technologies.length - 3 }}
            </span>
          </div>

          <!-- 底部操作区 -->
          <div
            class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800"
          >
            <router-link
              :to="`projects/${project.id}`"
              class="project-link group/link"
            >
              查看详情
              <i
                class="pi pi-arrow-right ml-1 transition-transform group-hover/link:translate-x-1"
              ></i>
            </router-link>

            <!-- 项目统计 -->
            <div
              class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
            >
              <div class="flex items-center space-x-1">
                <i class="pi pi-eye text-xs"></i>
                <span>1.2k</span>
              </div>
              <div class="flex items-center space-x-1">
                <i class="pi pi-heart text-xs"></i>
                <span>89</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useConfig from "../stores/config";
export default {
  name: "ProjectCard",
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  emits: ["view-details"],
  setup() {
    const config = useConfig();
    config.init();
    const baseUrl = config.ossBaseUrl || "";

    // 获取分类标签
    const getCategoryLabel = (category) => {
      const categoryMap = {
        frontend: "前端",
        backend: "后端",
        fullstack: "全栈",
        tools: "工具",
      };
      return categoryMap[category] || "其他";
    };

    return {
      baseUrl,
      getCategoryLabel,
    };
  },
};
</script>

<style scoped>
/* 现代化项目卡片样式 */
.project-card-container {
  animation: fadeInUp 0.6s ease-out both;
}

.card-modern {
  @apply bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm;
  @apply border border-gray-200/50 dark:border-gray-700/50;
  @apply shadow-xl hover:shadow-2xl;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-modern:hover {
  transform: translateY(-12px) scale(1.02);
}

/* 分类标签样式 */
.category-badge {
  @apply px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg;
  @apply border border-white/20 transition-all duration-300;
  animation: slideInDown 0.5s ease-out 0.2s both;
}

.category-frontend {
  @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white;
}

.category-backend {
  @apply bg-gradient-to-r from-green-500 to-green-600 text-white;
}

.category-fullstack {
  @apply bg-gradient-to-r from-purple-500 to-purple-600 text-white;
}

.category-tools {
  @apply bg-gradient-to-r from-orange-500 to-orange-600 text-white;
}

.category-default {
  @apply bg-gradient-to-r from-gray-500 to-gray-600 text-white;
}

/* 收藏按钮 */
.favorite-btn {
  @apply w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/20;
  @apply flex items-center justify-center hover:bg-red-500 hover:border-red-500;
  @apply transition-all duration-300;
}

/* 操作按钮 */
.action-btn {
  @apply relative w-14 h-14 rounded-full backdrop-blur-md border border-white/20;
  @apply flex items-center justify-center text-white transition-all duration-300;
  @apply transform hover:scale-110 active:scale-95;
  animation: bounceIn 0.5s ease-out both;
}

.action-btn:nth-child(1) {
  animation-delay: 0.1s;
}

.action-btn:nth-child(2) {
  animation-delay: 0.2s;
}

.action-btn:nth-child(3) {
  animation-delay: 0.3s;
}

.action-btn-primary {
  @apply bg-gradient-to-r from-primary to-teal-500 hover:from-teal-500 hover:to-primary;
}

.action-btn-secondary {
  @apply bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600;
}

.action-btn-accent {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500;
}

/* 按钮提示 */
.btn-tooltip {
  @apply absolute -bottom-8 left-1/2 transform -translate-x-1/2;
  @apply px-2 py-1 text-xs bg-black/80 text-white rounded whitespace-nowrap;
  @apply opacity-0 transition-opacity duration-300;
}

.action-btn:hover .btn-tooltip {
  @apply opacity-100;
}

/* 状态指示器 */
.status-indicator {
  @apply w-3 h-3 rounded-full border-2 border-white;
  animation: pulse 2s ease-in-out infinite;
}

.status-active {
  @apply bg-green-500;
}

.status-updated {
  @apply bg-blue-500;
  animation-delay: 1s;
}

/* 技术标签 */
.tech-tag {
  @apply px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800;
  @apply text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-300 hover:scale-105 hover:bg-primary/10 hover:border-primary/30;
  @apply hover:text-primary dark:hover:text-code-accent;
  animation: fadeInUp 0.4s ease-out both;
}

.tech-tag-more {
  @apply bg-gradient-to-r from-primary/10 to-teal-400/10 border-primary/30;
  @apply text-primary dark:text-code-accent font-medium;
}

/* 项目链接 */
.project-link {
  @apply text-primary dark:text-code-accent font-semibold;
  @apply flex items-center relative px-3 py-2 rounded-md;
  @apply transition-all duration-300;
  /* 确保文字在最上层显示 */
  position: relative;
  z-index: 10;
  /* 添加焦点样式以支持键盘导航 */
  @apply focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-code-accent/50;
}

.project-link::before {
  content: "";
  @apply absolute inset-0 rounded-md;
  @apply opacity-0 transition-opacity duration-300;
  /* 背景层在文字下方 */
  z-index: -1;
}

/* 亮色主题悬停和焦点效果 */
.project-link:hover,
.project-link:focus {
  /* 悬停和焦点时文字变为白色 */
  color: #ffffff !important;
}

.project-link:hover::before,
.project-link:focus::before {
  /* 亮色主题背景使用primary色 */
  background-color: #2a9d8f;
  @apply opacity-100;
}

/* 暗色主题悬停和焦点效果 */
.dark .project-link:hover,
.dark .project-link:focus {
  /* 暗色主题下悬停和焦点时文字变为深色 */
  color: #0a192f !important;
}

.dark .project-link:hover::before,
.dark .project-link:focus::before {
  /* 暗色主题背景使用code-accent色 */
  background-color: #64ffda;
  @apply opacity-100;
}

/* 工具类 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }

  70% {
    transform: scale(0.9);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .card-modern:hover {
    transform: translateY(-8px) scale(1.01);
  }

  .action-btn {
    @apply w-12 h-12;
  }

  .tech-tag {
    @apply px-2 py-1 text-xs;
  }

  /* 移动端project-link触摸优化 */
  .project-link {
    @apply px-4 py-3;
    /* 增大触摸目标 */
    min-height: 44px;
    /* 满足可访问性要求 */
  }

  /* 移动端触摸时的激活状态 */
  .project-link:active {
    transform: scale(0.98);
  }

  /* 确保移动端悬停效果正常 */
  .project-link:hover::before,
  .project-link:focus::before {
    @apply opacity-100;
  }

  /* 移动端暗色主题悬停效果 */
  .dark .project-link:hover,
  .dark .project-link:focus {
    color: #0a192f !important;
  }
}
</style>

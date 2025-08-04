<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">技术栈</h1>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          这些是我目前掌握和正在学习的技术栈，不断更新和扩展中。
        </p>
      </div>

      <!-- 技术分类标签 -->
      <div class="mb-8 flex flex-wrap justify-center gap-3">
        <button @click="selectedCategory = null"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300" :class="selectedCategory === null
            ? 'bg-primary text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ">
          全部
        </button>
        <button v-for="category in categories" :key="category" @click="selectedCategory = category"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300" :class="selectedCategory === category
            ? 'bg-primary text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ">
          {{ category }}
        </button>
      </div>

      <!-- 技术栈展示 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="tech in filteredTechStack" :key="tech.name"
          class="card p-5 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-start mb-4">
            <div
              class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary bg-opacity-10 dark:bg-opacity-20 rounded-lg mr-4">
              <i :class="tech.icon" class="text-primary dark:text-code-accent text-2xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-1 text-gray-800 dark:text-white">
                {{ tech.name }}
              </h3>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ tech.category }}
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-400">掌握程度</span>
              <span class="text-sm font-medium text-primary dark:text-code-accent">{{ tech.level }}%</span>
            </div>
            <ProgressBar :value="tech.level" :showValue="false" class="h-2" />
          </div>

          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ tech.description }}
          </p>

          <div class="flex flex-wrap gap-2">
            <span v-for="(project, index) in tech.projects" :key="index" class="tech-badge">
              {{ project }}
            </span>
          </div>
        </div>
      </div>

      <!-- 技术栈云 -->
      <div class="mt-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">技术标签云</h2>
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center gap-4">
            <div v-for="tech in techStack" :key="tech.name" class="tech-badge text-xs md:text-base py-2 px-4"
              :style="{ fontSize: `calc(0.85rem + ${tech.level * 0.008}rem)` }"
              v-tooltip="`${tech.name} - 掌握度 ${tech.level}%`">
              {{ tech.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 学习计划 -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-6 text-center">学习计划</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="plan in learningPlans" :key="plan.name" class="card p-5 border-l-4"
            :class="`border-${plan.color}`">
            <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">
              {{ plan.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ plan.description }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                计划完成时间: {{ plan.targetDate }}
              </span>
              <span class="text-sm font-medium" :class="`text-${plan.color}`">
                {{ plan.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from "vue";
import ProgressBar from "primevue/progressbar";

interface TechStack {
  name: string;
  category: string;
  level: number;
  icon: string;
  description: string;
  projects: string[];
}

interface LearningPlan {
  name: string;
  description: string;
  targetDate: string;
  status: string;
  color: string;
}

export default defineComponent({
  name: "TechStackView",
  components: {
    ProgressBar,
  },
  setup() {
    const selectedCategory = ref<string | null>(null);

    // 技术栈数据
    const techStack = ref<TechStack[]>([
      {
        name: "HTML5",
        category: "前端基础",
        level: 90,
        icon: "pi pi-code",
        description:
          "熟练掌握HTML5语义化标签、表单控件、多媒体元素等，能够构建符合W3C标准的网页结构。",
        projects: ["个人博客", "电商网站", "学习工具"],
      },
      {
        name: "CSS3",
        category: "前端基础",
        level: 85,
        icon: "pi pi-palette",
        description:
          "熟悉CSS3的各种选择器、动画、过渡效果和布局技术，能够实现复杂的页面样式和响应式设计。",
        projects: ["个人博客", "电商网站", "作品集"],
      },
      {
        name: "JavaScript",
        category: "前端基础",
        level: 80,
        icon: "pi pi-code",
        description:
          "掌握JavaScript的核心概念、DOM操作、事件处理、异步编程等，能够实现各种交互功能。",
        projects: ["天气应用", "任务管理器", "计算器"],
      },
      {
        name: "Vue.js",
        category: "前端框架",
        level: 75,
        icon: "pi pi-desktop",
        description:
          "熟悉Vue.js的组件化开发、生命周期、状态管理等，能够使用Vue构建单页应用。",
        projects: ["个人博客", "电商网站"],
      },
      {
        name: "React",
        category: "前端框架",
        level: 60,
        icon: "pi pi-desktop",
        description:
          "了解React的基本概念、组件、Hooks等，能够构建简单的React应用。",
        projects: ["天气应用", "笔记应用"],
      },
      {
        name: "Tailwind CSS",
        category: "前端工具",
        level: 70,
        icon: "pi pi-palette",
        description:
          "熟悉Tailwind CSS的工具类优先理念，能够快速构建现代化的用户界面。",
        projects: ["个人博客", "作品集"],
      },
      {
        name: "Node.js",
        category: "后端技术",
        level: 65,
        icon: "pi pi-server",
        description:
          "了解Node.js的基本概念和模块系统，能够使用Node.js构建简单的后端服务。",
        projects: ["API服务", "聊天应用"],
      },
      {
        name: "Express",
        category: "后端技术",
        level: 60,
        icon: "pi pi-server",
        description:
          "熟悉Express框架的路由、中间件等概念，能够构建RESTful API。",
        projects: ["任务管理API", "用户认证服务"],
      },
      {
        name: "MongoDB",
        category: "数据库",
        level: 55,
        icon: "pi pi-database",
        description:
          "了解MongoDB的基本操作和数据模型，能够进行基本的CRUD操作。",
        projects: ["博客系统", "用户管理"],
      },
      {
        name: "Git",
        category: "开发工具",
        level: 70,
        icon: "pi pi-code-branch",
        description:
          "熟悉Git的基本命令和工作流程，能够进行版本控制和团队协作。",
        projects: ["所有项目"],
      },
      {
        name: "Webpack",
        category: "开发工具",
        level: 50,
        icon: "pi pi-cog",
        description:
          "了解Webpack的基本配置和打包流程，能够进行简单的项目构建。",
        projects: ["Vue项目", "React项目"],
      },
      {
        name: "TypeScript",
        category: "编程语言",
        level: 45,
        icon: "pi pi-code",
        description:
          "初步了解TypeScript的类型系统和语法，能够编写简单的TypeScript代码。",
        projects: ["类型练习", "小型工具"],
      },
      {
        name: "Sass",
        category: "前端工具",
        level: 65,
        icon: "pi pi-palette",
        description:
          "熟悉Sass的变量、嵌套、混合等特性，能够使用Sass编写模块化的CSS。",
        projects: ["电商网站", "作品集"],
      },
      {
        name: "RESTful API",
        category: "后端技术",
        level: 60,
        icon: "pi pi-server",
        description:
          "了解RESTful API的设计原则和最佳实践，能够设计和实现符合REST规范的API。",
        projects: ["任务管理API", "用户服务"],
      },
      {
        name: "Responsive Design",
        category: "前端基础",
        level: 80,
        icon: "pi pi-mobile",
        description:
          "熟练掌握响应式设计原则和技术，能够创建适配各种设备的网页。",
        projects: ["个人博客", "电商网站", "作品集"],
      },
    ]);

    // 学习计划
    const learningPlans: LearningPlan[] = [
      {
        name: "TypeScript进阶",
        description:
          "深入学习TypeScript的高级类型、泛型、装饰器等特性，提高代码的类型安全性。",
        targetDate: "2023年12月",
        status: "进行中",
        color: "primary",
      },
      {
        name: "Next.js框架",
        description:
          "学习Next.js框架，掌握服务端渲染、静态生成、API路由等功能，构建高性能的React应用。",
        targetDate: "2024年2月",
        status: "计划中",
        color: "gray-500",
      },
      {
        name: "GraphQL",
        description:
          "学习GraphQL查询语言和相关工具，理解其与RESTful API的区别和优势。",
        targetDate: "2024年4月",
        status: "计划中",
        color: "gray-500",
      },
    ];

    // 提取所有分类
    const categories = computed(() => {
      const categorySet = new Set(techStack.value.map((tech) => tech.category));
      return Array.from(categorySet);
    });

    // 根据分类筛选技术栈
    const filteredTechStack = computed(() => {
      if (!selectedCategory.value) return techStack.value;
      return techStack.value.filter(
        (tech) => tech.category === selectedCategory.value,
      );
    });

    return {
      selectedCategory,
      techStack,
      learningPlans,
      categories,
      filteredTechStack,
    };
  },
});
</script>

<style scoped lang="scss">
.border-primary {
  @apply border-[#2A9D8F];
}

.border-gray-500 {
  @apply border-[#6B7280];
}

.text-primary {
  @apply text-[#2A9D8F] dark:text-code-accent;
}

.text-gray-500 {
  @apply text-[#6B7280] dark:text-gray-400;
}
</style>

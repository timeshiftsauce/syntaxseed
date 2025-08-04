<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">项目集</h1>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          这些是我在学习编程过程中完成的项目作品，展示了我的技术栈和解决问题的能力。
        </p>
      </div>

      <!-- 项目筛选 -->
      <div class="mb-8 flex flex-wrap justify-center gap-3">
        <button
          @click="selectedCategory = null"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
          :class="
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          "
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
          :class="
            selectedCategory === category
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          "
        >
          {{ category }}
        </button>
      </div>

      <!-- 项目列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="group"
        >
          <div class="card card-3d h-full">
            <div
              class="relative overflow-hidden rounded-t-lg h-48"
              @click.stop="viewProjectDetails(project)"
            >
              <img
                :src="ossBaseUrl + project.image"
                :alt="project.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              ></div>
              <div
                class="absolute bottom-0 left-0 w-full p-4 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"
              >
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in project.tags"
                    :key="tag"
                    class="tech-badge"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <div class="p-5" @click.stop="viewProjectDetails(project)">
              <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {{ project.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {{ project.description }}
              </p>
              <div
                class="flex justify-between items-center align-center relative"
              >
                <a
                  :href="project.demoUrl"
                  v-if="project.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="modern-btn-small modern-btn-primary group"
                >
                  <i class="pi pi-eye mr-1"></i> 演示
                </a>
                <a
                  v-if="project.codeUrl"
                  :href="project.codeUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="modern-btn-small modern-btn-outline group"
                >
                  <i class="pi pi-github mr-1"></i> 源码
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目详情模态框 -->
      <teleport to="#app">
        <transition name="fade" mode="out-in">
          <div
            v-if="selectedProject"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
            @click.stop="selectedProject = null"
          >
            <div
              class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              @click.stop
            >
              <div class="relative">
                <button
                  @click="selectedProject = null"
                  class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
                >
                  <i class="pi pi-times text-2xl"></i>
                </button>
                <img
                  :src="ossBaseUrl + selectedProject.image"
                  :alt="selectedProject.title"
                  class="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
              <div class="p-6">
                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in selectedProject.tags"
                    :key="tag"
                    class="tech-badge"
                  >
                    {{ tag }}
                  </span>
                </div>
                <h2
                  class="text-2xl font-bold mb-4 text-gray-800 dark:text-white"
                >
                  {{ selectedProject.title }}
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  {{ selectedProject.description }}
                </p>
                <div class="mb-6">
                  <h3
                    class="text-lg font-semibold mb-2 text-gray-800 dark:text-white"
                  >
                    项目特点
                  </h3>
                  <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    <li
                      v-for="(feature, index) in selectedProject.features"
                      :key="index"
                      class="mb-1"
                    >
                      {{ feature }}
                    </li>
                  </ul>
                </div>
                <div class="mb-6">
                  <h3
                    class="text-lg font-semibold mb-2 text-gray-800 dark:text-white"
                  >
                    技术栈
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tech in selectedProject.techStack"
                      :key="tech"
                      class="tech-badge"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4">
                  <a
                    :href="selectedProject.demoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="modern-btn modern-btn-primary group text-center"
                    v-if="selectedProject.demoUrl"
                  >
                    <span
                      class="relative z-10 flex items-center justify-center"
                    >
                      <i class="pi pi-eye mr-2"></i> 查看演示
                      <i
                        class="pi pi-external-link ml-2 group-hover:scale-110 transition-transform"
                      ></i>
                    </span>
                  </a>
                  <a
                    :href="selectedProject.codeUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="modern-btn modern-btn-outline group text-center"
                    v-if="selectedProject.codeUrl"
                  >
                    <span
                      class="relative z-10 flex items-center justify-center"
                    >
                      <i class="pi pi-github mr-2"></i> 查看源码
                      <i
                        class="pi pi-external-link ml-2 group-hover:scale-110 transition-transform"
                      ></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </teleport>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from "vue";
import { getProjects } from "@/api/index.js";
import { useRoute } from "vue-router";
import useConfig from "../../stores/config.js";
import { storeToRefs } from "pinia";

export default {
  name: "ProjectsView",
  setup() {
    const config = useConfig();
    const selectedCategory = ref(null);
    const selectedProject = ref(null);
    const { ossBaseUrl } = storeToRefs(config);
    // 模拟项目数据
    const projects = ref([]);

    // 提取所有分类
    const categories = computed(() => {
      const categorySet = new Set(
        projects.value.map((project) => project.category),
      );
      return Array.from(categorySet);
    });

    // 根据分类筛选项目
    const filteredProjects = computed(() => {
      if (!selectedCategory.value) return projects.value;
      return projects.value.filter(
        (project) => project.category === selectedCategory.value,
      );
    });

    // 查看项目详情
    const viewProjectDetails = (project) => {
      selectedProject.value = project;
    };
    // 初始化项目数据
    onMounted(async () => {
      try {
        const route = useRoute();
        let { data } = await getProjects();
        projects.value = data;
        const projectId = route.params.id;
        if (projectId) {
          const data = projects.value.find((p) => p.id == projectId);
          if (data) {
            await nextTick();

            selectedProject.value = data;
          } else {
            console.error("项目未找到:", projectId);
          }
        }
      } catch (error) {
        console.error("获取项目数据失败:", error);
      }
    });

    return {
      selectedCategory,
      selectedProject,
      categories,
      filteredProjects,
      viewProjectDetails,
      ossBaseUrl,
    };
  },
};
</script>

<style scoped lang="scss">
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

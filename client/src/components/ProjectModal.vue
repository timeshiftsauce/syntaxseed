<template>
  <div
    v-if="visible"
    class="project-modal fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <!-- 背景遮罩 -->
    <div
      class="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      :class="{ 'opacity-100': visible, 'opacity-0': !visible }"
      @click="close"
    ></div>

    <!-- 模态框内容 -->
    <div
      class="modal-content relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl transition-all duration-300 transform"
      :class="{
        'bg-white text-gray-800': !isDark,
        'bg-dark-800 text-white': isDark,
        'scale-100 opacity-100': visible,
        'scale-95 opacity-0': !visible,
      }"
    >
      <!-- 关闭按钮 -->
      <button
        @click="close"
        class="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300"
        :class="{
          'bg-primary/10 text-primary hover:bg-primary hover:text-white':
            !isDark,
          'bg-dark-700 text-secondary hover:bg-secondary hover:text-dark':
            isDark,
        }"
      >
        <i class="pi pi-times"></i>
      </button>

      <div v-if="project">
        <!-- 项目图片 -->
        <div class="relative h-64 md:h-80 overflow-hidden">
          <img
            :src="project.image"
            :alt="project.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6"
          >
            <div>
              <h2
                class="text-2xl md:text-3xl font-heading font-bold text-white mb-2"
              >
                {{ project.title }}
              </h2>
              <div class="flex flex-wrap gap-2">
                <TechBadge
                  v-for="tag in project.tags"
                  :key="tag"
                  :is-dark="true"
                >
                  {{ tag }}
                </TechBadge>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目详情 -->
        <div class="p-6">
          <div class="mb-6">
            <h3 class="text-xl font-heading font-bold mb-3">项目描述</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ project.description }}
            </p>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-heading font-bold mb-3">主要功能</h3>
            <ul
              class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300"
            >
              <li v-for="(feature, index) in project.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-heading font-bold mb-3">完成时间</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ formatDate(project.completionDate) }}
            </p>
          </div>

          <div class="flex flex-wrap gap-4">
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-4 py-2 rounded-md transition-all duration-300"
              :class="{
                'bg-primary text-white hover:bg-primary/90': !isDark,
                'bg-secondary text-dark hover:bg-secondary/90': isDark,
              }"
            >
              <i class="pi pi-external-link mr-2"></i>
              查看演示
            </a>

            <a
              v-if="project.sourceUrl"
              :href="project.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-4 py-2 rounded-md transition-all duration-300"
              :class="{
                'bg-primary/10 text-primary hover:bg-primary hover:text-white':
                  !isDark,
                'bg-dark-700 text-secondary hover:bg-secondary hover:text-dark':
                  isDark,
              }"
            >
              <i class="pi pi-github mr-2"></i>
              源代码
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import TechBadge from "./TechBadge.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Object,
    default: null,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

// 监听ESC键关闭模态框
const handleKeyDown = (e) => {
  if (e.key === "Escape" && props.visible) {
    close();
  }
};

// 关闭模态框
const close = () => {
  emit("close");
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 添加和移除事件监听器
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // 防止背景滚动
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // 恢复背景滚动
    }
  },
);
</script>

<style scoped>
.modal-content {
  max-height: calc(100vh - 2rem);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(42, 157, 143, 0.5);
  border-radius: 3px;
}
</style>

<template>
  <div class="tech-cloud relative h-60 md:h-80 w-full overflow-hidden">
    <div
      v-for="(tech, index) in technologies"
      :key="tech.name"
      class="tech-tag absolute transition-all duration-500 cursor-pointer"
      :class="{
        'text-primary hover:text-secondary': !isDark,
        'text-secondary hover:text-white': isDark,
      }"
      :style="getTagStyle(index)"
      @mouseover="highlightTag(index)"
      @mouseleave="resetTags"
    >
      <span class="whitespace-nowrap">{{ tech.name }}</span>

      <!-- 悬停时显示的技术详情 -->
      <div
        class="tech-details absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-dark-800 p-4 rounded-lg shadow-lg z-50 w-64 opacity-0 pointer-events-none transition-opacity duration-300"
        :class="{ 'opacity-100': highlightedIndex === index }"
      >
        <h4 class="font-heading font-bold text-lg mb-2 text-primary">
          {{ tech.name }}
        </h4>
        <div class="mb-2 flex items-center">
          <span class="text-sm mr-2">掌握度: {{ tech.proficiency }}%</span>
          <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full"
              :style="{ width: `${tech.proficiency}%` }"
            ></div>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {{ tech.description }}
        </p>
        <div
          v-if="tech.projects.length > 0"
          class="text-xs text-gray-500 dark:text-gray-400"
        >
          项目应用: {{ tech.projects.length }}个
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { techStack } from "../data/mockData";

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: "",
  },
});

const technologies = computed(() => {
  if (props.category && props.category !== "全部") {
    return techStack.filter((tech) => tech.category === props.category);
  }
  return techStack;
});

const highlightedIndex = ref(null);
const animationFrame = ref(null);
const positions = ref([]);

// 计算标签位置和大小
const calculatePositions = () => {
  const containerWidth =
    document.querySelector(".tech-cloud")?.clientWidth || 600;
  const containerHeight =
    document.querySelector(".tech-cloud")?.clientHeight || 400;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  positions.value = technologies.value.map((tech, index) => {
    // 根据技术掌握度和屏幕尺寸调整大小
    const baseSize = window.innerWidth < 768 ? 12 : 14;
    const size = baseSize + tech.proficiency / 12;

    // 随机位置，但保持在容器内
    const radius = Math.min(containerWidth, containerHeight) * 0.4;
    const angle = (index / technologies.value.length) * Math.PI * 2;
    const distance = Math.random() * radius;

    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    // 随机初始速度
    const vx = (Math.random() - 0.5) * 0.5;
    const vy = (Math.random() - 0.5) * 0.5;

    return { x, y, size, vx, vy };
  });
};

// 更新标签位置
const updatePositions = () => {
  const containerWidth =
    document.querySelector(".tech-cloud")?.clientWidth || 600;
  const containerHeight =
    document.querySelector(".tech-cloud")?.clientHeight || 400;

  positions.value = positions.value.map((pos) => {
    // 更新位置
    let x = pos.x + pos.vx;
    let y = pos.y + pos.vy;

    // 边界检查
    if (x < 0 || x > containerWidth) pos.vx *= -1;
    if (y < 0 || y > containerHeight) pos.vy *= -1;

    // 确保在容器内
    x = Math.max(0, Math.min(containerWidth, x));
    y = Math.max(0, Math.min(containerHeight, y));

    return { ...pos, x, y };
  });

  animationFrame.value = requestAnimationFrame(updatePositions);
};

// 获取标签样式
const getTagStyle = (index) => {
  if (!positions.value[index]) return {};

  const { x, y, size } = positions.value[index];
  const zIndex = highlightedIndex.value === index ? 50 : 10;

  return {
    left: `${x}px`,
    top: `${y}px`,
    fontSize: `${size}px`,
    zIndex: zIndex,
    transform: highlightedIndex.value === index ? "scale(1.2)" : "scale(1)",
  };
};

// 高亮标签
const highlightTag = (index) => {
  highlightedIndex.value = index;
};

// 重置标签
const resetTags = () => {
  highlightedIndex.value = null;
};

onMounted(() => {
  calculatePositions();
  updatePositions();

  window.addEventListener("resize", calculatePositions);
});

onBeforeUnmount(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }

  window.removeEventListener("resize", calculatePositions);
});
</script>

<style scoped>
.tech-cloud {
  perspective: 1000px;
}

.tech-tag {
  font-family: var(--font-heading);
  font-weight: 600;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.tech-details {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(42, 157, 143, 0.2);
}
</style>

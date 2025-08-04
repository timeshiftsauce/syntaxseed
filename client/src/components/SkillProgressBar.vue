<template>
  <div class="skill-progress mb-4">
    <div class="flex justify-between items-center mb-1">
      <h4 class="font-medium text-sm">{{ name }}</h4>
      <span class="text-xs font-medium">{{ value }}%</span>
    </div>
    <div
      class="relative h-2 w-full bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
        :class="{
          'bg-gradient-to-r from-primary to-secondary': !isDark,
          'bg-gradient-to-r from-secondary to-primary': isDark,
        }"
        :style="{ width: `${animatedValue}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
  animated: {
    type: Boolean,
    default: true,
  },
});

const animatedValue = ref(0);

const animateProgress = () => {
  if (!props.animated) {
    animatedValue.value = props.value;
    return;
  }

  // 重置动画
  animatedValue.value = 0;

  // 使用setTimeout来触发动画
  setTimeout(() => {
    animatedValue.value = props.value;
  }, 100);
};

onMounted(() => {
  animateProgress();
});

watch(() => props.value, animateProgress);
</script>

<style scoped>
.skill-progress {
  font-family: var(--font-sans);
}
</style>

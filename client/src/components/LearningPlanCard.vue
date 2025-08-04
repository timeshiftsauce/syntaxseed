<template>
  <div
    class="learning-plan-card p-5 rounded-lg transition-all duration-300 h-full"
    :class="{
      'bg-white shadow-md hover:shadow-lg': !isDark,
      'bg-dark-800 shadow-dark hover:shadow-dark-lg': isDark,
    }"
  >
    <h3 class="font-heading font-bold text-xl mb-3">{{ plan.title }}</h3>

    <p class="text-gray-700 dark:text-gray-300 mb-4 text-sm">
      {{ plan.description }}
    </p>

    <div class="mb-4">
      <h4 class="font-medium text-sm mb-2">学习资源:</h4>
      <ul class="space-y-1">
        <li
          v-for="resource in plan.resources"
          :key="resource.name"
          class="text-sm"
        >
          <a
            :href="resource.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center transition-colors duration-300"
            :class="{
              'text-primary hover:text-primary/80': !isDark,
              'text-secondary hover:text-secondary/80': isDark,
            }"
          >
            <i class="pi pi-link mr-1 text-xs"></i>
            {{ resource.name }}
          </a>
        </li>
      </ul>
    </div>

    <div class="mb-4 text-sm">
      <div class="flex justify-between mb-1">
        <span>计划时间:</span>
        <span>{{
          formatDateRange(plan.startDate, plan.estimatedCompletionDate)
        }}</span>
      </div>
    </div>

    <div>
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium">学习进度</span>
        <span class="text-xs font-medium">{{ plan.progress }}%</span>
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
          :style="{ width: `${plan.progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  plan: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
});

// 格式化日期范围
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "numeric",
    });
  };

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
</script>

<style scoped>
.learning-plan-card {
  border: 1px solid rgba(42, 157, 143, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.learning-plan-card:hover {
  transform: translateY(-5px);
}
</style>

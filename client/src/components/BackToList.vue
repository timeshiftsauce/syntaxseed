<template>
  <div class="back-to-list mb-8">
    <router-link to="/blog" class="back-btn group">
      <div class="flex items-center">
        <div class="icon-wrapper">
          <i
            class="pi pi-arrow-left transform transition-transform duration-300 group-hover:-translate-x-1"
          ></i>
        </div>
        <span class="ml-2">返回博客列表</span>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 动画效果控制
const showAnimation = ref(false);

// 组件挂载后添加动画效果
onMounted(() => {
  // 延迟一点时间再显示动画，让用户注意到这个按钮
  setTimeout(() => {
    showAnimation.value = true;
  }, 300);
});
</script>

<style lang="scss" scoped>
/* 返回按钮 */
.back-btn {
  @apply inline-flex items-center px-4 py-2 rounded-full text-sm font-medium;
  @apply bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm;
  @apply text-gray-700 dark:text-gray-300;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-300 hover:scale-105 hover:shadow-md;
  @apply hover:bg-gray-50 dark:hover:bg-gray-700/80;
  @apply hover:text-primary dark:hover:text-code-accent;
  animation: fadeIn 0.5s ease-out forwards;
}

/* 图标包装器 */
.icon-wrapper {
  @apply flex items-center justify-center w-6 h-6 rounded-full;
  @apply bg-gradient-to-r from-primary/20 to-primary/10 dark:from-code-accent/20 dark:to-code-accent/10;
  @apply text-primary dark:text-code-accent;
  @apply transition-all duration-300;
}

/* 按钮悬停时图标效果 */
.back-btn:hover .icon-wrapper {
  @apply bg-gradient-to-r from-primary/30 to-primary/20 dark:from-code-accent/30 dark:to-code-accent/20;
  @apply shadow-sm;
}

/* 动画关键帧 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .back-btn {
    @apply px-3 py-2 text-xs;
  }
}

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  .back-btn {
    @apply transition-none;
    animation: none;
  }

  .back-btn:hover {
    @apply transform-none scale-100;
  }

  .group:hover .pi-arrow-left {
    @apply transform-none;
  }

  .icon-wrapper {
    @apply transition-none;
  }
}
</style>

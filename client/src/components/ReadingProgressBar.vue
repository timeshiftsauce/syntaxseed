<template>
  <div
    class="reading-progress fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-code-accent z-50 transition-all duration-300"
    :style="{ width: `${progress}%` }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const progress = ref(0);

const calculateReadingProgress = () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrollTop = window.scrollY;

  if (documentHeight > 0) {
    progress.value = (scrollTop / documentHeight) * 100;
  } else {
    progress.value = 0;
  }
};

onMounted(() => {
  window.addEventListener("scroll", calculateReadingProgress);
  // 初始计算
  calculateReadingProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", calculateReadingProgress);
});
</script>

<style scoped>
.reading-progress {
  box-shadow: 0 0 10px rgba(42, 157, 143, 0.5);
}
</style>

<template>
  <span
    class="tech-badge inline-block px-2 py-1 rounded-md text-xs font-medium transition-all duration-300"
    :class="{
      'bg-primary/10 text-primary': !isDark,
      'bg-primary/20 text-secondary': isDark,
    }"
  >
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.tech-badge {
  backdrop-filter: blur(4px);
}
</style>

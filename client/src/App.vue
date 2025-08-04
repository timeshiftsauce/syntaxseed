<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <Toast />
</template>

<script>
import { onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import theme from "@/stores/theme.ts";
import useConfig from "@/stores/config.ts";
import { Toast } from "primevue";
import { setToastInstance } from "@/utils/toast.ts";
export default {
  setup() {
    const useTheme = theme();
    const config = useConfig();
    const toast = useToast();

    config.init();

    onMounted(() => {
      useTheme.init();
      // 初始化全局 toast 实例
      setToastInstance(toast);
    });
  },
};
</script>

<style>
/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

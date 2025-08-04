import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import "./assets/main.scss";

// 导入全局加载服务
import { LoadingService } from "./utils/loading";

// 导入用户store
import { useUserStore } from "./stores/userAuth.js";

// 导入全局 toast 服务
import { setToastInstance } from "./utils/toast.ts";

// 导入 SEO 检查工具（仅在开发环境）
if (import.meta.env.DEV) {
  import("./utils/seoChecker");
}

// PrimeVue样式
import Aura from "@primeuix/themes/aura";

const app = createApp(App);

app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".dark",
    },
  },
});
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(ToastService);

// 注册自定义指令
import Tooltip from "primevue/tooltip";
app.directive("tooltip", Tooltip);

// 注册全局加载服务
app.config.globalProperties.$loading = LoadingService;

// 初始化用户状态
const userStore = useUserStore();
userStore.initUser();

app.mount("#app");

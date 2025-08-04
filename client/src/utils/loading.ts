import { createApp, type ComponentPublicInstance } from "vue";
import GlobalLoading from "../components/GlobalLoading.vue";

let loadingInstance: null | ComponentPublicInstance | fn = null;
let loadingCount = 0;
interface fn {
  show: () => void;
  hide: () => void;
}
/**
 * 创建全局加载实例
 */
function createLoadingInstance() {
  if (loadingInstance) return;

  // 创建挂载点
  const mountNode = document.createElement("div");
  document.body.appendChild(mountNode);

  // 创建加载组件实例
  const app = createApp(GlobalLoading);

  // 挂载应用
  loadingInstance = app.mount(mountNode);
}

/**
 * 显示全局加载
 */
export function showLoading() {
  if (!loadingInstance) {
    createLoadingInstance();
  }

  loadingCount++;

  (loadingInstance as fn).show();
}

/**
 * 隐藏全局加载
 */
export function hideLoading() {
  if (!loadingInstance) return;

  loadingCount--;
  if (loadingCount <= 0) {
    loadingCount = 0;
    (loadingInstance as fn).hide();
  }
}

/**
 * 全局加载服务
 */
export const LoadingService = {
  show: showLoading,
  hide: hideLoading,
};

export default LoadingService;

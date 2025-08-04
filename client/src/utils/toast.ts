// 全局 Toast 服务
import type { ToastMessageOptions, ToastServiceMethods } from "primevue";

let toastInstance: null | ToastServiceMethods = null;

export const setToastInstance = (toast: ToastServiceMethods) => {
  toastInstance = toast;
};
/**
 * 显示Toast
 * @param {ToastMessageOptions} options - 配置
 *
 * */
export const showToast = (options: ToastMessageOptions) => {
  if (toastInstance) {
    toastInstance.add(options);
  } else {
    console.warn("Toast instance not initialized");
  }
};

// 便捷方法

export const toast = {
  /**
   * 成功toast
   * @param { string } summary - 标题.
   * @param {any} detail - 内容.
   * @param {number} life - 持续时间 default 3000.
   */
  success: (summary?: string, detail?: any, life: number = 3000) => {
    showToast({ severity: "success", summary, detail, life });
  },
  /**
   * 失败toast
   * @param { string } summary - 标题
   * @param {any} detail - 内容
   * @param {number} life - 持续时间 default 3000
   */
  error: (summary?: string, detail?: any, life: number = 3000) => {
    showToast({ severity: "error", summary, detail, life });
  },
  /**
   * 提示toast
   * @param { string } summary - 标题
   * @param {any} detail - 内容
   * @param {number} life - 持续时间 default 3000
   */
  info: (summary?: string, detail?: any, life: number = 3000) => {
    showToast({ severity: "info", summary, detail, life });
  },
  /**
   * 警告toast
   * @param { string } summary - 标题
   * @param {any} detail - 内容
   * @param {number} life - 持续时间 default 3000
   */
  warn: (summary?: string, detail?: any, life: number = 3000) => {
    showToast({ severity: "warn", summary, detail, life });
  },
};

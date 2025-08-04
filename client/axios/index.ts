/// <reference types="vite/client" />
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { LoadingService } from "@/utils/loading.ts";
import { dealWithPermissionError, isRefresh, setAxiosToken } from "@/auth/auth.ts";
import { useUserStore } from "@/stores/userAuth.ts";

// 定义错误响应类型
interface ApiErrorResponse {
  msg?: string;
  message?: string;
  code?: number;
}


function logInfo(config: InternalAxiosRequestConfig): void {
  console.group("%c🛩️API request:", "color:#2CC3B0;font-size:1.2em");
  console.log(
    "%cMethod: %c" + config.method?.toUpperCase(),
    "color:#E5548C",
    "color:black",
  );
  console.log("%cUrl: %c" + config.url, "color:#29ACE8", "color:black");
  console.log("%cBaseUrl: %c" + config.baseURL, "color:#29ACE8", "color:black");
  const fullUrl = config.baseURL
    ? `${config.baseURL}${config.url}`
    : config.url;
  console.log("%cFull URL: %c" + fullUrl, "color:#F39C12", "color:black");
  console.log("%cParams:", "color:#FF79C6", config.params || "no data");
  console.log("%cData:", "color:#FF79C6", config.data || "no data");
  console.groupEnd();
}
/**
 * 判断 URL 是否为完整的 API 接口地址
 * @param url - 要检查的 URL
 * @returns boolean - 如果是完整的 URL 返回 true，否则返回 false
 */
function isFullUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 处理 baseURL，如果是完整的 URL 就直接返回，否则拼接默认的 API 前缀
 * @param baseUrl - 基础 URL 或路径
 * @returns string - 处理后的完整 baseURL
 */
function processBaseUrl(baseUrl: string): string {
  // 如果已经是完整的 URL，直接返回
  if (isFullUrl(baseUrl)) {
    return baseUrl;
  }

  // 如果是相对路径，拼接浏览器的 host
  const browserHost =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"; // 服务端渲染时的后备方案

  // 确保路径以 / 开头
  const normalizedPath = baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`;

  return `${browserHost}${normalizedPath}`;
}

// 获取环境变量中的 baseURL 并处理
const rawBaseURL: string = import.meta.env.VITE_API_BASEURL || "/api";
const baseURL: string = processBaseUrl(rawBaseURL);
export const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 1000 * 60, // 1 minute
  headers: {
    "Content-Type": "application/json",
  }
});

export interface ApiOptions extends AxiosRequestConfig {
  showLoading?: boolean,
  [key: string]: unknown
}


export default async function $http<T = unknown>(
  url: string,
  options?: ApiOptions
): Promise<T> {
  const { showLoading = true, ...axiosOptions } = options || {};
  if (showLoading) {
    LoadingService.show();
  }
  return new Promise<T>((resolve, reject) => {
    instance
      .request<T>({
        url,
        ...axiosOptions,
      })
      .then((response: AxiosResponse<T>) => {
        resolve(response.data);
      })
      .catch(async (error: AxiosError<ApiErrorResponse>) => {
        if (error.response && error.response?.status === 401) {
          if (options ? !isRefresh(options) : true) {
            try {
              const result = await dealWithPermissionError<T>(url, options);
              if (result !== null) {
                if (typeof result == 'string') {
                  reject(result)
                } else {
                  resolve(result)
                }
              } else {
                reject('认证失败');
              }
            } catch {
              reject('认证失败');
            }
            return
          }
          const auth = useUserStore()
          await auth.logout()
        } else {
          const errorMsg = error.response?.data?.msg ||
            error.response?.data?.message ||
            error.message ||
            '请求失败';
          reject(errorMsg);
        }
      })
      .finally(() => {
        if (showLoading) {
          LoadingService.hide();
        }
      });
  });
}
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  logInfo(config);
  setAxiosToken(config)
  return config;
});



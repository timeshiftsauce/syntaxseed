import { useUserStore } from "@/stores/userAuth.ts";
import type { InternalAxiosRequestConfig } from "axios";
import $http, { type ApiOptions } from "../../axios";
import type { refreshApi } from "@/utils/apiType.ts";

export function setAxiosToken(config: InternalAxiosRequestConfig) {
  const auth = useUserStore();

  if (auth.isLoggedIn && !config.headers.hasAuthorization()) {
    config.headers.Authorization = `Bearer ${auth.Token}`;
  }
}

const FreshKey = "__is_refresh";
let isGetFreshTokening: Promise<any> | undefined;
export async function dealWithPermissionError<T>(
  url: string,
  options?: ApiOptions,
): Promise<T | null | string> {
  const auth = useUserStore();
  async function reRequest() {
    try {
      return await $http<T>(url, options);
    } catch (error) {
      return error as string;
    }
  }
  if (isGetFreshTokening) {
    const isSuccess = (await isGetFreshTokening) !== null;
    if (isSuccess) return await reRequest();
    return "登录状态过期";
  }
  if (!auth.refreshToken && !auth.isLoggedIn) {
    return null;
  }
  async function get() {
    console.warn("TestRefreshToken");

    if (auth.refreshToken) {
      try {
        const data = await $http<refreshApi>("/auth/refresh-token", {
          showLoading: false,
          headers: {
            Authorization: `Bearer ${auth.refreshToken}`,
          },
          method: "post",
          [FreshKey]: true,
        });
        isGetFreshTokening = undefined;
        if (data.success) {
          auth.SetRefreshTokens(data.data.accessToken, data.data.refreshToken);
          return await reRequest();
        } else {
          console.error("Token refresh failed:", data.message);
          return null;
        }
      } catch (refreshError) {
        isGetFreshTokening = undefined;

        console.error("Token refresh failed:", refreshError);
        return null;
      }
    }
    return null;
  }
  isGetFreshTokening = get();
  return isGetFreshTokening;
}
export function isRefresh(options: ApiOptions): boolean {
  return !!options[FreshKey];
}

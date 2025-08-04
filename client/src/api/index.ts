import $http from "../../axios/index";
import type {
  Blog,
  Project,
  TechStack,
  TypewriterTexts,
} from "@/utils/apiType";
export function getConfig(showLoading = false) {
  return $http("/config", {
    method: "get",
    showLoading,
  });
}
export function getTypewriterTexts(showLoading = false) {
  return $http<TypewriterTexts>("/typewriter-texts", {
    method: "get",
    showLoading,
  });
}
export function getTimelines(showLoading = false) {
  return $http("/timelines", {
    method: "get",
    showLoading,
  });
}
export function getProjects(params, showLoading = false) {
  return $http<Project>("/projects", {
    method: "get",
    params,
    showLoading,
  });
}
export function getTechStack(showLoading = false) {
  return $http<TechStack>("/tech-stack", {
    method: "get",
    showLoading,
  });
}

/**
 * 获取博客文章列表
 * @param {Object} params - 查询参数，包括页码、每页数量、关键词等
 * @param {number} params.page - 页码，默认为1
 * @param {number} params.limit - 每页数量，默认为10
 * @param {string} params.keywords - 搜索关键词
 * @param {boolean} showLoading - 是否显示加载动画，默认为false
 */
export function getBlogs(params = {}, showLoading = false) {
  return $http<Blog>("/blogs", {
    method: "get",
    params,
    showLoading,
  });
}

/**
 * 获取博客文章详情
 * @param {number|string} id - 博客文章ID
 * @param {boolean} showLoading - 是否显示加载动画，默认为true
 */
export function getBlogDetail(id: string, showLoading = false) {
  return $http(`/blog/${id}`, {
    method: "get",
    showLoading,
  });
}

/**
 * 获取博客标签列表
 * @param {boolean} showLoading - 是否显示加载动画，默认为true
 */
export function getBlogTags(showLoading = false) {
  return $http("/blog/tags", {
    method: "get",
    showLoading,
  });
}

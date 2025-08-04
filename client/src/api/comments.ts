import $http from "../../axios/index";
import { getMockComments, mockSubmitComment } from "../data/mockComments";

// 是否使用模拟数据（在实际API实现前使用）
const USE_MOCK = false;

/**
 * 评论数据接口
 */
export interface Comment {
  id: string;
  blog_id: string;
  author: string;
  content: string;
  create_time: string | number; // 可以是ISO日期字符串或时间戳
  avatar?: string;
  website?: string;
  email?: string;
  parent_id?: string | null;
}

/**
 * 评论列表响应接口
 */
export interface CommentsResponse {
  data: Comment[];
  total: number;
  page: number;
  limit: number;
  spendTime?: string;
  code: number;
}

/**
 * 获取文章评论列表
 * @param blogId - 博客文章ID
 * @param params - 查询参数
 * @param showLoading - 是否显示加载动画，默认为false
 */
export function getComments(
  blogId: string | number,
  params: { page?: number; limit?: number } = {},
  showLoading = false,
): Promise<CommentsResponse> {
  // 使用模拟数据
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = getMockComments(params.page || 1, params.limit || 10);
        resolve({
          ...mockData,
          code: 200,
        });
      }, 800); // 模拟网络延迟
    });
  }

  // 使用实际API
  return $http("/comments", {
    method: "get",
    params: {
      blog_id: String(blogId), // 确保blogId始终为字符串
      page: params.page || 1,
      limit: params.limit || 10,
    },
    showLoading,
  });
}

/**
 * 提交评论响应接口
 */
export interface SubmitCommentResponse {
  message: string;
  data: Comment;
  spendTime?: string;
  code: number;
}

/**
 * 提交评论
 * @param commentData - 评论数据
 * @param showLoading - 是否显示加载动画，默认为true
 */
export function submitComment(
  commentData: {
    blog_id: string | number;
    author: string;
    email: string;
    content: string;
    website?: string;
    parent_id?: string | number;
  },
  showLoading = true,
): Promise<SubmitCommentResponse> {
  // 使用模拟数据
  if (USE_MOCK) {
    return mockSubmitComment({
      ...commentData,
      parent_id: commentData.parent_id
        ? String(commentData.parent_id)
        : undefined,
    }) as Promise<SubmitCommentResponse>;
  }

  // 使用实际API
  // 确保blog_id是字符串类型
  const formattedData = {
    ...commentData,
    blog_id: String(commentData.blog_id),
    parent_id: commentData.parent_id
      ? String(commentData.parent_id)
      : undefined,
  };

  return $http("/comments", {
    method: "post",
    data: formattedData,
    showLoading,
  }) as unknown as Promise<SubmitCommentResponse>;
}

/**
 * 获取评论数量响应接口
 */
export interface CommentCountResponse {
  blog_id: string;
  count: number;
  code: number;
}

/**
 * 获取文章评论数量
 * @param blogId - 博客文章ID
 * @param showLoading - 是否显示加载动画，默认为false
 */
export function getCommentCount(
  blogId: string | number,
  showLoading = false,
): Promise<CommentCountResponse> {
  // 使用模拟数据
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockComments = getMockComments(1, 100);
        resolve({
          blog_id: String(blogId),
          count: mockComments.total,
          code: 200,
        });
      }, 300); // 模拟网络延迟
    });
  }

  // 使用实际API
  return $http(`/comments/count/${String(blogId)}`, {
    // 确保blogId始终为字符串
    method: "get",
    showLoading,
  });
}

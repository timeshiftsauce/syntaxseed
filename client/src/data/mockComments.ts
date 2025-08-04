// 模拟评论数据 - 扁平结构，通过parent_id关联
export const mockComments = [
  // 第一个根评论
  {
    id: "1",
    blog_id: "1",
    author: "张三",
    content: `这篇文章写得非常好，我学到了很多关于Vue 3的知识！**感谢分享**。
    
    <script>
    window.alert('5')
    </script>
    `,
    create_time: Math.floor(Date.now() / 1000) - 3600 * 24 * 2, // 2天前
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    website: "https://example.com",
    parent_id: null,
  },
  // 第一个根评论的回复
  {
    id: "2",
    blog_id: "1",
    author: "李四",
    content: "我也觉得很有帮助，特别是Composition API的部分解释得很清楚。",
    create_time: Math.floor(Date.now() / 1000) - 3600 * 24, // 1天前
    parent_id: "1",
  },
  // 第一个根评论的回复的回复（二级回复）
  {
    id: "3",
    blog_id: "1",
    author: "张三",
    content: "是的，我正在学习Vue 3，这篇文章帮了我很大忙。",
    create_time: Math.floor(Date.now() / 1000) - 3600 * 12, // 12小时前
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    website: "https://example.com",
    parent_id: "2",
  },
  // 第二个根评论
  {
    id: "4",
    blog_id: "1",
    author: "王五",
    content:
      "我有一个问题，关于文章中提到的`ref`和`reactive`的区别：\n\n```js\nconst count = ref(0)\nconst state = reactive({ count: 0 })\n```\n\n这两种方式有什么实际使用场景的区别吗？",
    create_time: Math.floor(Date.now() / 1000) - 3600 * 36, // 36小时前
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    parent_id: null,
  },
  // 第二个根评论的回复
  {
    id: "5",
    blog_id: "1",
    author: "管理员",
    content:
      "很好的问题！`ref`适合单个值的响应式，而`reactive`更适合对象类型的响应式数据。\n\n主要区别是：\n1. `ref`需要通过`.value`访问\n2. `reactive`不能直接替换整个对象\n\n根据你的使用场景选择合适的方式。",
    create_time: Math.floor(Date.now() / 1000) - 3600 * 24, // 24小时前
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    website: "https://syntaxseed.com",
    parent_id: "4",
  },
  // 第三个根评论
  {
    id: "6",
    blog_id: "1",
    author: "赵六",
    content: "文章中的代码示例非常实用，我已经在我的项目中应用了，效果很好！",
    create_time: Math.floor(Date.now() / 1000) - 3600 * 48, // 48小时前
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    parent_id: null,
  },
  // 第四个根评论
  {
    id: "7",
    blog_id: "1",
    author: "小明",
    content: "期待更多关于Vue 3和Vite的文章，这个组合太强大了！",
    create_time: Math.floor(Date.now() / 1000) - 3600 * 72, // 72小时前
    avatar: "",
    parent_id: null,
  },
];

// 模拟评论分页数据
export function getMockComments(page = 1, limit = 10) {
  // 在实际应用中，分页应该在服务器端进行
  // 这里为了简化，我们返回所有评论，让前端构建树结构
  return {
    data: mockComments,
    total: mockComments.length,
    page,
    limit,
  };
}

// 模拟提交评论
export function mockSubmitComment(commentData: {
  author: string;
  content: string;
  email?: string;
  website?: string;
  parent_id?: string;
}) {
  // 模拟API延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment = {
        id: String(Date.now()),
        blog_id: "1", // 添加 blog_id 字段
        author: commentData.author,
        content: commentData.content,
        create_time: Math.floor(Date.now() / 1000),
        website: commentData.website,
        parent_id: commentData.parent_id || null,
      };

      // 在实际应用中，这里会将评论保存到数据库
      // 这里只是模拟成功响应
      resolve({
        data: newComment,
        message: "评论提交成功",
        code: 200,
      });
    }, 1000);
  });
}

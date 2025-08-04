const express = require('express')
const router = express.Router()
const { db, testConnection } = require('../db.js')
const { AppError } = require('../middleware/errorHandler')
const { commentLimiter, adminLimiter } = require('../middleware/rateLimiter')

/**
 * 将对象中指定键的JSON字符串值转换为仅包含value属性的数组
 * @param {Object} item - 包含目标JSON字符串的对象（如数据库查询结果项）
 * @param {string} key - 需要解析的JSON字符串对应的键名（如"technolog"或"features"）
 * @returns {Array} 解析后的数组，每个元素为原JSON数组中对象的value属性值
 */
function JsonToArray(item, key) {
  try {
    if (!item[key]) return []
    const parsed = JSON.parse(item[key])
    if (!Array.isArray(parsed)) return []
    return parsed.map((i) => i.value || i)
  } catch (error) {
    console.error(`解析JSON失败 (${key}):`, error)
    return []
  }
}

/**
 * 异步错误处理包装器
 * @param {Function} fn - 异步路由处理函数
 * @returns {Function} 包装后的路由处理函数
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

/**
 * 验证数据库连接
 * @returns {Promise<void>}
 * @throws {AppError} 如果数据库连接失败
 */
const validateDbConnection = async () => {
  const isConnected = await testConnection()
  if (!isConnected) {
    throw new AppError('数据库连接失败，请稍后重试', 503)
  }
}

router.get(
  '/config',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const namesKey = [
      'minTitle',
      'title',
      'link',
      'upload_cdn_url',
      'record_number',
      'Introduction',
    ]

    const config = await db('ba_config')
      .whereIn('name', namesKey)
      .select('name', 'value')
      .timeout(5000) // 添加查询超时

    if (config.length === 0) {
      throw new AppError('未找到配置信息', 404)
    }

    // 格式化配置数据
    const formattedConfig = config.reduce((acc, item) => {
      acc[item.name] = item.value
      return acc
    }, {})

    // 设置缓存
    res.setHeader('Cache-Control', 'public, max-age=3600') // 缓存1小时
    res.status(200).json(formattedConfig)
  }),
)
router.get(
  '/typewriter-texts',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const texts = await db('ba_typewritertexts')
      .orderBy('id', 'asc')
      .select('name')
      .timeout(5000) // 添加查询超时

    const count = await db('ba_typewritertexts')
      .count('* as total')
      .timeout(3000) // 添加查询超时

    const data = texts.map((item) => item.name)

    res.status(200).json({
      data,
      total: count[0].total,
      code: 200,
    })
  }),
)
router.get(
  '/timelines',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()

    const timelines = await db('ba_timeline')
      .orderBy('year', 'desc')
      .select()
      .timeout(5000) // 添加查询超时

    const count = await db('ba_timeline').count('* as total').timeout(3000) // 添加查询超时

    const formattedTimelines = timelines.map((item) => {
      try {
        item.technologies = JsonToArray(item, 'technolog')
        item.date = item.data

        try {
          const skills = JSON.parse(item.skills)
          item.skills = Array.isArray(skills)
            ? skills.map((i) => ({
              name: i.key || '',
              level: i.value || 0,
            }))
            : []
        } catch (e) {
          console.error('解析技能JSON失败:', e)
          item.skills = []
        }

        return item
      } catch (e) {
        console.error('处理时间线项目失败:', e)
        return item
      }
    })

    res.status(200).json({
      data: formattedTimelines,
      total: count[0].total,
      code: 200,
      spendTime: Date.now() - timeStamp + ' ms',
    })
  }),
)
router.get(
  '/projects',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()
    const limit = Number(req.query.limit) || 100 // 默认每页100条
    const page = Number(req.query.page) || 1 // 默认页码为1

    // 参数验证
    if (!limit || isNaN(limit) || limit <= 0 || limit > 500) {
      throw new AppError('无效的limit参数，应为1-500之间的数字', 400)
    }

    if (!page || isNaN(page) || page <= 0) {
      throw new AppError('无效的page参数，应为正整数', 400)
    }

    const offset = (page - 1) * limit

    // 技术栈映射
    const box = {
      opt0: 'HTML',
      opt1: 'CSS',
      opt2: 'JavaScript',
      opt3: 'React',
      opt4: 'Vue',
      opt5: 'Nodejs',
      opt6: 'Java',
      opt7: 'Python',
      opt8: 'php',
      opt9: 'pinia',
      opt10: 'vite',
      opt11: 'NestJS',
      opt12: 'TypeScript',
      opt13: 'OBS',
      opt14: 'electron',
      opt15: 'JQ',
      opt16: 'Express',
      opt17: 'SASS/LESS',
      opt18: 'Webpack',
    }

    // 并行查询数据和总数
    const [projects, countResult] = await Promise.all([
      db('ba_project')
        .limit(limit)
        .offset(offset)
        .orderBy('weigh', 'desc')
        .select()
        .timeout(5000), // 添加查询超时

      db('ba_project').count('* as total').timeout(3000), // 添加查询超时
    ])

    // 处理项目数据
    const formattedProjects = projects.map((item) => {
      try {
        // 处理标签
        item.tags = item.checkbox
          ? item.checkbox.split(',').map((i) => box[i] || i)
          : []
        delete item.checkbox

        // 处理图片
        try {
          item.images = item.images
            ? item.images.split(',').map((i) => i.trim())
            : []
          item.image = item.images[0] || ''
        } catch (e) {
          console.error('处理项目图片失败:', e)
          item.images = []
          item.image = ''
        }

        // 处理特性和技术栈
        item.features = JsonToArray(item, 'features')
        item.techStack = JsonToArray(item, 'techStack')

        return item
      } catch (e) {
        console.error('处理项目数据失败:', e)
        return item
      }
    })

    res.status(200).json({
      data: formattedProjects,
      total: countResult[0].total,
      code: 200,
      page: page,
      limit: limit,
      spendTime: Date.now() - timeStamp + ' ms',
    })
  }),
)
router.get(
  '/tech-stack',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()

    const techStack = await db('ba_tech_stack')
      .orderBy('id', 'asc')
      .where('status', '=', 1)
      .select()
      .timeout(5000) // 添加查询超时

    if (techStack.length === 0) {
      throw new AppError('未找到技术栈数据', 404)
    }

    res.status(200).json({
      data: techStack,
      code: 200,
      spendTime: Date.now() - timeStamp + ' ms',
    })
  }),
)
router.get(
  '/blogs',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()
    const limit = Number(req.query.limit) || 100 // 默认每页100条
    const page = Number(req.query.page) || 1 // 默认页码为1
    const keywords = req.query.keywords || ''

    // 参数验证
    if (!limit || isNaN(limit) || limit <= 0 || limit > 500) {
      throw new AppError('无效的limit参数，应为1-500之间的数字', 400)
    }

    if (!page || isNaN(page) || page <= 0) {
      throw new AppError('无效的page参数，应为正整数', 400)
    }

    const offset = (page - 1) * limit

    // 构建查询
    let query = db('ba_blogdetail')
      .limit(limit)
      .offset(offset)
      .orderBy('create_time', 'desc')

    // 添加关键词搜索条件
    if (keywords) {
      // 使用参数化查询防止SQL注入
      query = query.where(function () {
        this.where('title', 'like', `%${keywords}%`).orWhere(
          'tags',
          'like',
          `%${keywords}%`,
        )
      })
    }

    // 选择字段
    query = query
      .select(
        db.raw('CAST(id AS CHAR) as id'),
        'title',
        'create_time',
        'readTime',
        'tags',
        'image',
        'excerpt',
      )
      .timeout(5000) // 添加查询超时

    // 并行查询数据和总数
    const [blogs, countResult] = await Promise.all([
      query,
      db('ba_blogdetail').count('* as total').timeout(3000),
    ])

    // 处理博客数据
    const formattedBlogs = blogs.map((item) => {
      try {
        item.tags = JsonToArray(item, 'tags')
        return item
      } catch (e) {
        console.error('处理博客标签失败:', e)
        item.tags = []
        return item
      }
    })

    res.status(200).json({
      data: formattedBlogs,
      total: countResult[0].total,
      spendTime: Date.now() - timeStamp + ' ms',
      code: 200,
      keywords: keywords,
      limit: limit,
      page: page,
    })
  }),
)
router.get(
  '/blog/tags',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()

    const tags = await db('ba_blogdetail')
      .select('tags')
      .distinct()
      .whereNotNull('tags')
      .timeout(5000) // 添加查询超时

    if (tags.length === 0) {
      throw new AppError('未找到标签', 404)
    }

    try {
      // 处理标签数据
      const formattedTags = tags
        .map((item) => JsonToArray(item, 'tags'))
        .flat()
        .filter((tag) => tag) // 过滤空值

      const uniqueTags = Array.from(new Set(formattedTags))

      res.status(200).json({
        tags: uniqueTags,
        total: uniqueTags.length,
        code: 200,
        spendTime: Date.now() - timeStamp + ' ms',
      })
    } catch (error) {
      console.error('处理博客标签失败:', error)
      throw new AppError('处理博客标签失败', 500)
    }
  }),
)
router.get(
  '/blog/:id',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()
    const id = req.params.id

    // 参数验证
    if (!id) {
      throw new AppError('缺少博客ID', 400)
    }

    // 获取博客详情
    const blog = await db('ba_blogdetail')
      .where('id', id)
      .select()
      .first()
      .timeout(5000) // 添加查询超时

    if (!blog) {
      throw new AppError('未找到博客', 404)
    }

    try {
      // 处理标签
      blog.tags = JsonToArray(blog, 'tags')

      // 获取当前文章的创建时间
      const currentCreateTime = blog.create_time

      // 并行获取上一篇和下一篇文章
      const [prevPost, nextPost] = await Promise.all([
        // 获取上一篇文章（创建时间小于当前文章的最新一篇）
        db('ba_blogdetail')
          .where('create_time', '<', currentCreateTime)
          .orderBy('create_time', 'desc')
          .select(db.raw('CAST(id AS CHAR) as id'), 'title')
          .first()
          .timeout(3000),

        // 获取下一篇文章（创建时间大于当前文章的最早一篇）
        db('ba_blogdetail')
          .where('create_time', '>', currentCreateTime)
          .orderBy('create_time', 'asc')
          .select(db.raw('CAST(id AS CHAR) as id'), 'title')
          .first()
          .timeout(3000),
      ])

      // 将前后文章信息添加到响应中
      blog.prevPost = prevPost || null
      blog.nextPost = nextPost || null
      blog.id = id

      res.status(200).json({
        ...blog,
        code: 200,
        spendTime: Date.now() - timeStamp + ' ms',
      })
    } catch (error) {
      console.error('处理博客详情失败:', error)
      throw new AppError('处理博客详情失败', 500)
    }
  }),
)

/**
 * 获取博客评论列表
 * 支持分页、按博客ID筛选
 * 返回限定数量的顶级评论，并递归添加其所有回复
 */
router.get(
  '/comments',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()
    const blogId = req.query.blog_id
    const limit = Number(req.query.limit) || 10 // 默认每页10条
    const page = Number(req.query.page) || 1 // 默认页码为1

    // 参数验证
    if (!limit || isNaN(limit) || limit <= 0 || limit > 100) {
      throw new AppError('无效的limit参数，应为1-100之间的数字', 400)
    }

    if (!page || isNaN(page) || page <= 0) {
      throw new AppError('无效的page参数，应为正整数', 400)
    }

    const offset = (page - 1) * limit

    // 1. 构建查询条件
    const baseQuery = { status: '1' }
    if (blogId) {
      baseQuery.blog_id = blogId
    }

    // 2. 获取顶级评论总数（用于分页）
    const countQuery = db('ba_comments')
      .where(baseQuery)
      .whereNull('parent_id')
      .count('* as total')
      .timeout(3000)

    // 3. 获取顶级评论（没有父评论的评论）
    const rootCommentsQuery = db('ba_comments')
      .where(baseQuery)
      .whereNull('parent_id')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .offset(offset)
      .select(
        db.raw('CAST(id AS CHAR) as id'),
        db.raw('CAST(blog_id AS CHAR) as blog_id'),
        'author',
        'content',
        db.raw('UNIX_TIMESTAMP(create_time) as create_time'),
        'avatar',
        'website',
        db.raw('CAST(parent_id AS CHAR) as parent_id'),
      )
      .timeout(5000)

    // 4. 并行执行查询
    const [count, rootComments] = await Promise.all([
      countQuery,
      rootCommentsQuery,
    ])

    // 5. 如果有顶级评论，获取所有回复（不分页）
    let allReplies = []
    if (rootComments.length > 0) {
      try {
        // 获取所有顶级评论的ID
        const rootCommentIds = rootComments.map((comment) => comment.id)

        // 递归获取所有回复，但限制递归深度以防止过度查询
        const fetchReplies = async (parentIds, depth = 0) => {
          if (!parentIds.length || depth > 5) return [] // 限制最大递归深度为5

          // 获取直接回复
          const replies = await db('ba_comments')
            .where('status', '1')
            .whereIn('parent_id', parentIds)
            .select(
              db.raw('CAST(id AS CHAR) as id'),
              db.raw('CAST(blog_id AS CHAR) as blog_id'),
              'author',
              'content',
              db.raw('UNIX_TIMESTAMP(create_time) as create_time'),
              'avatar',
              'website',
              db.raw('CAST(parent_id AS CHAR) as parent_id'),
            )
            .timeout(5000)

          // 如果有回复，继续递归获取这些回复的回复
          if (replies.length > 0) {
            const replyIds = replies.map((reply) => reply.id)
            const nestedReplies = await fetchReplies(replyIds, depth + 1)
            return [...replies, ...nestedReplies]
          }

          return replies
        }

        // 获取所有回复，设置超时
        const fetchRepliesWithTimeout = async (parentIds) => {
          return Promise.race([
            fetchReplies(parentIds),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('获取评论回复超时')), 8000),
            ),
          ])
        }

        // 获取所有回复
        allReplies = await fetchRepliesWithTimeout(rootCommentIds)
      } catch (error) {
        console.error('获取评论回复失败:', error)
        // 即使获取回复失败，我们仍然返回顶级评论
        allReplies = []
      }
    }

    // 6. 合并顶级评论和所有回复
    const allComments = [...rootComments, ...allReplies]

    res.status(200).json({
      data: allComments,
      total: count[0].total,
      page: page,
      limit: limit,
      spendTime: Date.now() - timeStamp + ' ms',
      code: 200,
    })
  }),
)

/**
 * 提交评论
 * 需要提供博客ID、作者名称、评论内容等信息
 */
router.post(
  '/comments',
  commentLimiter,
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()
    const { blog_id, author, content, email, website, parent_id } = req.body

    // 验证必填字段
    if (!blog_id || !author || !content) {
      throw new AppError(
        '缺少必要参数，博客ID、作者名称和评论内容为必填项',
        400,
      )
    }

    // 内容长度验证
    if (content.length > 2000) {
      throw new AppError('评论内容过长，请控制在2000字符以内', 400)
    }

    if (author.length > 50) {
      throw new AppError('作者名称过长，请控制在50字符以内', 400)
    }

    // 验证博客是否存在
    const blog = await db('ba_blogdetail')
      .where('id', blog_id)
      .first()
      .timeout(3000)

    if (!blog) {
      throw new AppError('博客不存在', 404)
    }

    // 如果提供了父评论ID，验证父评论是否存在
    if (parent_id) {
      const parentComment = await db('ba_comments')
        .where('id', parent_id)
        .first()
        .timeout(3000)

      if (!parentComment) {
        throw new AppError('父评论不存在', 404)
      }
    }

    // 准备评论数据
    const commentData = {
      blog_id,
      author,
      content,
      email: email || null,
      website: website || null,
      parent_id: parent_id || null,
      avatar: null, // 可以根据email生成Gravatar头像URL
      // status: 1 //默认审核
    }

    try {
      // 插入评论
      const [commentId] = await db('ba_comments')
        .insert(commentData)
        .timeout(5000)

      // 获取插入后的评论数据
      const newComment = await db('ba_comments')
        .where('id', commentId)
        .select(
          db.raw('CAST(id AS CHAR) as id'),
          db.raw('CAST(blog_id AS CHAR) as blog_id'),
          'author',
          'content',
          db.raw('UNIX_TIMESTAMP(create_time) as create_time'), // 转换为Unix时间戳
          'avatar',
          'website',
          db.raw('CAST(parent_id AS CHAR) as parent_id'),
          'status',
        )
        .first()
        .timeout(3000)

      if (!commentData?.status == 1) {
        res.status(201).json({
          message: '评论提交成功，等待审核',
          data: newComment,
          spendTime: Date.now() - timeStamp + ' ms',
          code: 201,
        })
      } else {
        res.status(201).json({
          message: '评论提交成功。',
          data: newComment,
          spendTime: Date.now() - timeStamp + ' ms',
          code: 200,
        })
      }
    } catch (error) {
      console.error('提交评论失败:', error)
      throw new AppError('提交评论失败，请稍后重试', 500)
    }
  }),
)

/**
 * 获取指定博客的评论数量
 */
router.get(
  '/comments/count/:blogId',
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()
    const blogId = req.params.blogId

    if (!blogId) {
      throw new AppError('缺少博客ID', 400)
    }

    const count = await db('ba_comments')
      .where({
        blog_id: blogId,
        status: '1', // 只统计已审核的评论
      })
      .count('* as total')
      .timeout(3000)

    res.status(200).json({
      blog_id: blogId,
      count: count[0].total,
      code: 200,
      spendTime: Date.now() - timeStamp + ' ms',
    })
  }),
)

/**
 * 管理员审核评论
 * 需要管理员权限
 */
router.put(
  '/admin/comments/:id/status',
  adminLimiter,
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()
    const commentId = req.params.id
    const { status } = req.body

    // 这里应该添加管理员权限验证
    // TODO: 添加权限验证中间件

    if (status !== '0' && status !== '1') {
      throw new AppError('无效的状态值', 400)
    }

    // 验证评论是否存在
    const comment = await db('ba_comments')
      .where('id', commentId)
      .first()
      .timeout(3000)

    if (!comment) {
      throw new AppError('评论不存在', 404)
    }

    // 更新评论状态
    await db('ba_comments')
      .where('id', commentId)
      .update({
        status,
        update_time: db.fn.now(),
      })
      .timeout(5000)

    res.status(200).json({
      message: status === '1' ? '评论已审核通过' : '评论已设为待审核',
      code: 200,
      spendTime: Date.now() - timeStamp + ' ms',
    })
  }),
)

/**
 * 管理员删除评论
 * 需要管理员权限
 */
router.delete(
  '/admin/comments/:id',
  adminLimiter,
  catchAsync(async (req, res) => {
    await validateDbConnection()

    const timeStamp = Date.now()
    const commentId = req.params.id

    // 这里应该添加管理员权限验证
    // TODO: 添加权限验证中间件

    // 验证评论是否存在
    const comment = await db('ba_comments')
      .where('id', commentId)
      .first()
      .timeout(3000)

    if (!comment) {
      throw new AppError('评论不存在', 404)
    }

    // 删除评论
    await db('ba_comments').where('id', commentId).delete().timeout(5000)

    res.status(200).json({
      message: '评论已删除',
      code: 200,
      spendTime: Date.now() - timeStamp + ' ms',
    })
  }),
)

module.exports = router

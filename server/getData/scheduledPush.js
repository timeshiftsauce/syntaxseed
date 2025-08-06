const express = require('express')
const router = express.Router()
const scheduledPushService = require('../services/scheduledPushService')

/**
 * 获取定时任务状态
 */
router.get('/status', async (req, res) => {
  try {
    const tasksStatus = scheduledPushService.getTasksStatus()
    const nextExecutionTimes = scheduledPushService.getNextExecutionTimes()

    res.json({
      success: true,
      data: {
        enabled: scheduledPushService.isEnabled,
        tasks: tasksStatus,
        nextExecutionTimes,
        availableTasks: [
          {
            name: 'sitemapAndPush',
            description: '生成sitemap并推送新增URL到所有搜索引擎（百度+Bing）',
            schedule: '每天凌晨2点'
          },
          {
            name: 'morningPush',
            description: '推送新增URL到所有搜索引擎（百度+Bing）',
            schedule: '每天上午10点'
          },
          {
            name: 'eveningPush',
            description: '推送新增URL到所有搜索引擎（百度+Bing）',
            schedule: '每天下午6点'
          },
          {
            name: 'weeklyFullPush',
            description: '推送所有URL到所有搜索引擎（百度+Bing，谨慎使用）',
            schedule: '每周日凌晨3点'
          }
        ]
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取定时任务状态失败',
      error: error.message
    })
  }
})

/**
 * 手动执行指定任务
 */
router.post('/execute/:taskName', async (req, res) => {
  try {
    const { taskName } = req.params

    if (!['sitemapAndPush', 'morningPush', 'eveningPush', 'weeklyFullPush'].includes(taskName)) {
      return res.status(400).json({
        success: false,
        message: '无效的任务名称'
      })
    }

    const result = await scheduledPushService.executeTask(taskName)

    if (result.success) {
      res.json({
        success: true,
        message: `任务 ${taskName} 执行成功`,
        data: result.result
      })
    } else {
      res.status(400).json({
        success: false,
        message: `任务 ${taskName} 执行失败`,
        error: result.message
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '执行任务失败',
      error: error.message
    })
  }
})

/**
 * 启动指定任务
 */
router.post('/start/:taskName', async (req, res) => {
  try {
    const { taskName } = req.params
    const success = scheduledPushService.startTask(taskName)

    if (success) {
      res.json({
        success: true,
        message: `任务 ${taskName} 已启动`
      })
    } else {
      res.status(404).json({
        success: false,
        message: `任务 ${taskName} 不存在`
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '启动任务失败',
      error: error.message
    })
  }
})

/**
 * 停止指定任务
 */
router.post('/stop/:taskName', async (req, res) => {
  try {
    const { taskName } = req.params
    const success = scheduledPushService.stopTask(taskName)

    if (success) {
      res.json({
        success: true,
        message: `任务 ${taskName} 已停止`
      })
    } else {
      res.status(404).json({
        success: false,
        message: `任务 ${taskName} 不存在`
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '停止任务失败',
      error: error.message
    })
  }
})

/**
 * 停止所有任务
 */
router.post('/stop-all', async (req, res) => {
  try {
    scheduledPushService.stopAllTasks()

    res.json({
      success: true,
      message: '所有定时任务已停止'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '停止所有任务失败',
      error: error.message
    })
  }
})

/**
 * 启动所有任务
 */
router.post('/start-all', async (req, res) => {
  try {
    scheduledPushService.startAllTasks()

    res.json({
      success: true,
      message: '所有定时任务已启动'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '启动所有任务失败',
      error: error.message
    })
  }
})

/**
 * 获取任务执行日志（简单版本）
 */
router.get('/logs', async (req, res) => {
  try {
    // 这里可以读取日志文件或从数据库获取执行记录
    // 暂时返回模拟数据
    const logs = [
      {
        timestamp: new Date().toISOString(),
        taskName: 'morningPush',
        status: 'success',
        message: '推送了3个新增URL',
        duration: '2.5s'
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        taskName: 'sitemapAndPush',
        status: 'success',
        message: '生成sitemap并推送了5个新增URL',
        duration: '4.2s'
      }
    ]

    res.json({
      success: true,
      data: logs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取任务日志失败',
      error: error.message
    })
  }
})

module.exports = router
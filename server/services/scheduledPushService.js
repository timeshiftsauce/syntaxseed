const cron = require('node-cron')
const sitemapService = require('./sitemapService')

class ScheduledPushService {
  constructor() {
    this.tasks = new Map()
    this.isEnabled = process.env.ENABLE_SCHEDULED_PUSH !== 'false'
  }

  /**
   * 启动所有定时推送任务
   */
  startAllTasks() {
    if (!this.isEnabled) {
      console.log('⚠️  定时推送任务已禁用')
      return
    }

    console.log('🚀 启动定时推送任务...')

    // 任务1: 每天凌晨2点 - 生成sitemap并推送新增URL
    this.startSitemapAndPushTask()

    // 任务2: 每天上午10点 - 推送新增URL
    this.startMorningPushTask()

    // 任务3: 每天下午6点 - 推送新增URL
    this.startEveningPushTask()

    // 任务4: 每周日凌晨3点 - 推送所有URL（可选，谨慎使用）
    // this.startWeeklyFullPushTask()

    console.log('✅ 所有定时推送任务已启动')
  }

  /**
   * 任务1: 每天凌晨2点 - 生成sitemap并推送新增URL
   */
  startSitemapAndPushTask() {
    const task = cron.schedule('0 2 * * *', async () => {
      console.log('🕐 [定时任务] 开始执行sitemap生成和百度推送')

      try {
        // 生成sitemap
        await sitemapService.saveSitemap({ pushToBaidu: false })

        // 推送新增URL到所有搜索引擎
        const result = await sitemapService.pushToAllSearchEngines({ pushAll: false })

        if (result.success) {
          console.log(`✅ [定时任务] sitemap生成和搜索引擎推送完成，推送了 ${result.newUrlsCount || 0} 个新增URL到 ${result.successfulEngines} 个搜索引擎`)
        } else {
          console.error('❌ [定时任务] 搜索引擎推送失败:', result.message)
        }
      } catch (error) {
        console.error('❌ [定时任务] sitemap生成和搜索引擎推送失败:', error.message)
      }
    }, {
      timezone: 'Asia/Shanghai',
      scheduled: false
    })

    this.tasks.set('sitemapAndPush', task)
    task.start()
    console.log('📅 已启动: 每天凌晨2点 - sitemap生成和搜索引擎推送（百度+Bing）')
  }

  /**
   * 任务2: 每天上午10点 - 推送新增URL
   */
  startMorningPushTask() {
    const task = cron.schedule('0 10 * * *', async () => {
      console.log('🕙 [定时任务] 开始执行上午搜索引擎推送')

      try {
        const result = await sitemapService.pushToAllSearchEngines({ pushAll: false })

        if (result.success) {
          if (result.newUrlsCount > 0) {
            console.log(`✅ [定时任务] 上午搜索引擎推送完成，推送了 ${result.newUrlsCount} 个新增URL到 ${result.successfulEngines} 个搜索引擎`)
          } else {
            console.log('✅ [定时任务] 上午搜索引擎推送完成，没有新增URL需要推送')
          }
        } else {
          console.error('❌ [定时任务] 上午搜索引擎推送失败:', result.message)
        }
      } catch (error) {
        console.error('❌ [定时任务] 上午搜索引擎推送失败:', error.message)
      }
    }, {
      timezone: 'Asia/Shanghai',
      scheduled: false
    })

    this.tasks.set('morningPush', task)
    task.start()
    console.log('📅 已启动: 每天上午10点 - 搜索引擎推送新增URL（百度+Bing）')
  }

  /**
   * 任务3: 每天下午6点 - 推送新增URL
   */
  startEveningPushTask() {
    const task = cron.schedule('0 18 * * *', async () => {
      console.log('🕕 [定时任务] 开始执行下午搜索引擎推送')

      try {
        const result = await sitemapService.pushToAllSearchEngines({ pushAll: false })

        if (result.success) {
          if (result.newUrlsCount > 0) {
            console.log(`✅ [定时任务] 下午搜索引擎推送完成，推送了 ${result.newUrlsCount} 个新增URL到 ${result.successfulEngines} 个搜索引擎`)
          } else {
            console.log('✅ [定时任务] 下午搜索引擎推送完成，没有新增URL需要推送')
          }
        } else {
          console.error('❌ [定时任务] 下午搜索引擎推送失败:', result.message)
        }
      } catch (error) {
        console.error('❌ [定时任务] 下午搜索引擎推送失败:', error.message)
      }
    }, {
      timezone: 'Asia/Shanghai',
      scheduled: false
    })

    this.tasks.set('eveningPush', task)
    task.start()
    console.log('📅 已启动: 每天下午6点 - 搜索引擎推送新增URL（百度+Bing）')
  }

  /**
   * 任务4: 每周日凌晨3点 - 推送所有URL（谨慎使用，会消耗大量配额）
   */
  startWeeklyFullPushTask() {
    const task = cron.schedule('0 3 * * 0', async () => {
      console.log('🕒 [定时任务] 开始执行周度全量搜索引擎推送')

      try {
        const result = await sitemapService.pushToAllSearchEngines({ pushAll: true })

        if (result.success) {
          console.log(`✅ [定时任务] 周度全量搜索引擎推送完成，推送了所有URL到 ${result.successfulEngines} 个搜索引擎`)
        } else {
          console.error('❌ [定时任务] 周度全量搜索引擎推送失败:', result.message)
        }
      } catch (error) {
        console.error('❌ [定时任务] 周度全量搜索引擎推送失败:', error.message)
      }
    }, {
      timezone: 'Asia/Shanghai',
      scheduled: false
    })

    this.tasks.set('weeklyFullPush', task)
    task.start()
    console.log('📅 已启动: 每周日凌晨3点 - 搜索引擎推送所有URL（百度+Bing）')
  }

  /**
   * 停止指定任务
   */
  stopTask(taskName) {
    const task = this.tasks.get(taskName)
    if (task) {
      task.stop()
      console.log(`⏹️  已停止任务: ${taskName}`)
      return true
    }
    return false
  }

  /**
   * 启动指定任务
   */
  startTask(taskName) {
    const task = this.tasks.get(taskName)
    if (task) {
      task.start()
      console.log(`▶️  已启动任务: ${taskName}`)
      return true
    }
    return false
  }

  /**
   * 停止所有任务
   */
  stopAllTasks() {
    this.tasks.forEach((task, name) => {
      task.stop()
      console.log(`⏹️  已停止任务: ${name}`)
    })
    console.log('⏹️  所有定时推送任务已停止')
  }

  /**
   * 获取任务状态
   */
  getTasksStatus() {
    const status = {}
    this.tasks.forEach((task, name) => {
      status[name] = {
        running: task.running || false,
        scheduled: task.scheduled || false
      }
    })
    return status
  }

  /**
   * 手动执行指定任务
   */
  async executeTask(taskName) {
    console.log(`🔧 手动执行任务: ${taskName}`)

    try {
      switch (taskName) {
        case 'sitemapAndPush':
          await sitemapService.saveSitemap({ pushToBaidu: false })
          const result1 = await sitemapService.pushToAllSearchEngines({ pushAll: false })
          return { success: true, result: result1 }

        case 'morningPush':
        case 'eveningPush':
          const result2 = await sitemapService.pushToAllSearchEngines({ pushAll: false })
          return { success: true, result: result2 }

        case 'weeklyFullPush':
          const result3 = await sitemapService.pushToAllSearchEngines({ pushAll: true })
          return { success: true, result: result3 }

        default:
          return { success: false, message: '未知任务名称' }
      }
    } catch (error) {
      console.error(`❌ 手动执行任务失败: ${taskName}`, error.message)
      return { success: false, message: error.message }
    }
  }

  /**
   * 获取下次执行时间
   */
  getNextExecutionTimes() {
    const times = {}

    // 计算下次执行时间的辅助函数
    const getNextCronTime = (cronExpression) => {
      try {
        const task = cron.schedule(cronExpression, () => { }, { scheduled: false })
        // 这里需要使用cron库的方法来计算下次执行时间
        // 由于node-cron没有直接提供这个功能，我们返回描述性文本
        return '根据cron表达式计算'
      } catch (error) {
        return '计算失败'
      }
    }

    times.sitemapAndPush = '每天凌晨2点'
    times.morningPush = '每天上午10点'
    times.eveningPush = '每天下午6点'
    times.weeklyFullPush = '每周日凌晨3点'

    return times
  }
}

// 创建单例实例
const scheduledPushService = new ScheduledPushService()

module.exports = scheduledPushService
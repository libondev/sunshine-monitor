import { Monitoring, MonitoringClient } from '@sunshine-monitor/core'

import { ErrorsIntegration, ErrorsIntegrationOptions } from './integrations'
import { BrowserTransport } from './transport'

/**
 * SDK 初始化配置选项
 */
interface InitOptions {
  /** 数据上报地址 */
  dsn: string
  /** 错误监控插件配置，设为 false 可完全禁用错误监控 */
  errorsIntegration?: ErrorsIntegrationOptions | false
}

/**
 * 初始化浏览器监控 SDK
 * @param options 配置选项
 * @returns 监控客户端实例
 *
 * @example
 * ```typescript
 * // 基础用法
 * const client = init({ dsn: 'https://your-server.com/api/report' })
 *
 * // 自定义错误监控配置
 * const client = init({
 *   dsn: 'https://your-server.com/api/report',
 *   errorsIntegration: {
 *     captureResourceErrors: false,
 *     beforeSend: (payload) => {
 *       if (payload.message === 'Script error.') return null
 *       return payload
 *     }
 *   }
 * })
 *
 * // 禁用错误监控
 * const client = init({
 *   dsn: 'https://your-server.com/api/report',
 *   errorsIntegration: false
 * })
 * ```
 */
export const init = (options: InitOptions): MonitoringClient => {
  const monitoring = new Monitoring(options)

  const transport = new BrowserTransport(options.dsn)

  monitoring.init(transport)

  // 根据配置初始化错误监控插件
  if (options.errorsIntegration !== false) {
    new ErrorsIntegration(transport, options.errorsIntegration).init()
  }

  return monitoring
}

import { Monitoring, MonitoringClient } from '@sunshine-monitor/core'

import { BrowserTransport } from './transport'

interface InitOptions {
  dsn: string
}

/**
 * 初始化浏览器监控 SDK
 * @param options 配置选项
 * @returns 监控客户端实例
 */
export const init = (options: InitOptions): MonitoringClient => {
  const monitoring = new Monitoring(options)

  const transport = new BrowserTransport(options.dsn)

  monitoring.init(transport)

  return monitoring
}

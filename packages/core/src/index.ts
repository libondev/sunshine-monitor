import { MonitoringOptions } from './interface'
import { createEnvelope, Transport } from './transport'

export type { Envelope, EnvelopeType, Transport, TransportResponse } from './transport'
export { createEnvelope } from './transport'

/**
 * 监控客户端公共接口
 * 仅暴露给外部使用的方法
 */
export interface MonitoringClient {
  /** 上报消息 */
  reportMessage(message: string): void
  /** 上报事件 */
  reportEvent(event: unknown): void
}

export class Monitoring implements MonitoringClient {
  private transport: Transport | null = null
  constructor(private options: MonitoringOptions) {
    console.log('Monitoring initialized with options:', options)
  }

  /**
   * 内部初始化方法，不对外暴露
   */
  init(transport: Transport) {
    this.transport = transport
  }

  /**
   * 上报简单消息
   * 适合快速埋点，比如用户点击、页面访问
   */
  reportMessage(message: string) {
    const envelope = createEnvelope('message', { message })
    this.transport?.send(envelope)
  }

  /**
   * 上报复杂事件
   * 适合性能指标、业务事件、自定义错误等场景
   */
  reportEvent(event: unknown) {
    const envelope = createEnvelope('event', { event })
    this.transport?.send(envelope)
  }
}

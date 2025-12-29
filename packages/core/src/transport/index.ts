/**
 * Envelope 类型标识
 * - message: 简单消息上报（埋点、日志等）
 * - event: 复杂事件上报（性能指标、业务事件、错误等）
 */
export type EnvelopeType = 'message' | 'event'

/**
 * Envelope 头部信息
 * 包含元数据，用于路由和处理
 */
export interface EnvelopeHeader {
  /** 数据类型标识 */
  type: EnvelopeType
  /** 时间戳（毫秒） */
  timestamp: number
  /** SDK 版本（可选） */
  sdk_version?: string
}

/**
 * Envelope Item - 实际的数据载体
 * 根据 type 不同，payload 结构也不同
 */
export interface EnvelopeItem<T = unknown> {
  /** item 类型，与 header.type 对应 */
  type: EnvelopeType
  /** 实际数据 */
  payload: T
}

/**
 * Envelope - 统一的数据传输结构
 * 将类型信息内聚到数据结构中
 */
export interface Envelope<T = unknown> {
  header: EnvelopeHeader
  items: EnvelopeItem<T>[]
}

/**
 * Transport 响应结构
 */
export interface TransportResponse {
  /** HTTP 状态码 */
  statusCode: number
  /** 响应头（用于 rate limiting 等） */
  headers?: Record<string, string | null>
}

/**
 * 统一的传输层接口
 * 各平台适配器需要实现此接口
 */
export interface Transport {
  /**
   * 发送 Envelope 数据
   * @param envelope - 封装好的数据包
   * @returns Promise，包含响应信息
   */
  send(envelope: Envelope): Promise<TransportResponse>

  /**
   * 刷新缓冲区，确保所有待发送数据都已发出
   * @param timeout - 超时时间（毫秒）
   * @returns 是否在超时前完成
   */
  flush?(timeout?: number): Promise<boolean>
}

/**
 * 创建 Envelope 的工具函数
 * @param type - 数据类型
 * @param payload - 实际数据
 */
export const createEnvelope = <T>(type: EnvelopeType, payload: T): Envelope<T> => ({
  header: {
    type,
    timestamp: Date.now(),
  },
  items: [{ type, payload }],
})

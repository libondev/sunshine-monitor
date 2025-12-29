/**
 * Envelope 数据结构（与前端 SDK 保持一致）
 */
export interface EnvelopeHeader {
  type: 'message' | 'event'
  timestamp: number
  sdk_version?: string
}

export interface EnvelopeItem {
  type: 'message' | 'event'
  payload: Record<string, unknown>
}

/**
 * 浏览器上下文信息
 */
export interface BrowserContext {
  name: string
  version: string
}

/**
 * 操作系统上下文信息
 */
export interface OSContext {
  name: string
  version: string
}

/**
 * 设备上下文信息
 */
export interface DeviceContext {
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  screenWidth: number
  screenHeight: number
  screenResolution: string
  pixelRatio: number
  orientation: 'portrait' | 'landscape'
  viewportWidth: number
  viewportHeight: number
  colorDepth: number
  touchPoints: number
}

/**
 * 页面上下文信息
 */
export interface PageContext {
  url: string
  path: string
  query: string
  hash: string
  title: string
  referrer: string
}

/**
 * 网络上下文信息
 */
export interface NetworkContext {
  online: boolean
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g'
  downlink?: number
  rtt?: number
}

/**
 * 完整的浏览器环境信息（与前端 browser-utils 保持一致）
 */
export interface BrowserInfo {
  browser: BrowserContext
  os: OSContext
  device: DeviceContext
  page: PageContext
  network: NetworkContext
  language: string
  timezone: string
  timestamp: number
  userAgent: string
}

/**
 * 追踪接口请求参数
 */
export interface TrackingParams {
  header: EnvelopeHeader
  items: EnvelopeItem[]
  browserInfo?: BrowserInfo
}

/**
 * ClickHouse 插入数据结构
 * payload 和 browser_info 使用原生 JSON 类型，直接传对象
 */
export interface MonitorEventRow {
  app_id: string
  event_type: string
  timestamp: string
  sdk_version: string
  payload: Record<string, unknown>
  browser_info: BrowserInfo | Record<string, never>
  client_ip: string
}

/**
 * 浏览器上下文信息
 */
export interface BrowserContext {
  /** 浏览器名称，如 Chrome, Firefox, Safari */
  name: string
  /** 浏览器版本号 */
  version: string
}

/**
 * 操作系统上下文信息
 */
export interface OSContext {
  /** 操作系统名称，如 Windows, macOS, Linux, iOS, Android */
  name: string
  /** 操作系统版本号 */
  version: string
}

/**
 * 设备上下文信息
 */
export interface DeviceContext {
  /** 设备类型：desktop, mobile, tablet */
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  /** 屏幕宽度（像素） */
  screenWidth: number
  /** 屏幕高度（像素） */
  screenHeight: number
  /** 屏幕分辨率，如 "1920x1080" */
  screenResolution: string
  /** 设备像素比 */
  pixelRatio: number
  /** 屏幕方向 */
  orientation: 'portrait' | 'landscape'
  /** 视口宽度 */
  viewportWidth: number
  /** 视口高度 */
  viewportHeight: number
  /** 颜色深度 */
  colorDepth: number
  /** 触摸点数量（0 表示不支持触摸） */
  touchPoints: number
}

/**
 * 页面上下文信息
 */
export interface PageContext {
  /** 完整 URL */
  url: string
  /** 路径 */
  path: string
  /** 查询参数 */
  query: string
  /** 哈希值 */
  hash: string
  /** 页面标题 */
  title: string
  /** 来源页面 */
  referrer: string
}

/**
 * 网络上下文信息
 */
export interface NetworkContext {
  /** 是否在线 */
  online: boolean
  /** 网络类型（如果支持 Network Information API） */
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g'
  /** 下行速度（Mbps） */
  downlink?: number
  /** 往返时间（ms） */
  rtt?: number
}

/**
 * 完整的浏览器环境信息
 */
export interface BrowserInfo {
  /** 浏览器信息 */
  browser: BrowserContext
  /** 操作系统信息 */
  os: OSContext
  /** 设备信息 */
  device: DeviceContext
  /** 页面信息 */
  page: PageContext
  /** 网络信息 */
  network: NetworkContext
  /** 用户语言 */
  language: string
  /** 时区 */
  timezone: string
  /** 采集时间戳 */
  timestamp: number
  /** 原始 User-Agent */
  userAgent: string
}

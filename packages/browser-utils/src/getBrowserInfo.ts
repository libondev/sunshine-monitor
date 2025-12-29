import { parseBrowser, parseOS } from './parser'
import type { BrowserInfo, DeviceContext, NetworkContext, PageContext } from './types'

/**
 * Network Information API 类型扩展
 * 该 API 尚未被所有浏览器支持，需要类型声明
 */
interface NetworkInformation {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g'
  downlink?: number
  rtt?: number
}

declare global {
  interface Navigator {
    connection?: NetworkInformation
  }
}

/**
 * 检测设备类型
 * 通过 User-Agent 和触摸支持来判断设备类型
 */
const detectDeviceType = (ua: string): DeviceContext['type'] => {
  const lowerUA = ua.toLowerCase()

  // 平板设备检测
  if (/ipad|tablet|playbook|silk/i.test(lowerUA)) {
    return 'tablet'
  }

  // 移动设备检测
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(lowerUA)) {
    return 'mobile'
  }

  // Android 但不是 mobile 通常是平板
  if (/android/i.test(lowerUA)) {
    return 'tablet'
  }

  return 'desktop'
}

/**
 * 获取屏幕方向
 */
const getOrientation = (): DeviceContext['orientation'] => {
  if (typeof window === 'undefined') {
    return 'portrait'
  }

  // 优先使用 Screen Orientation API
  if (window.screen?.orientation?.type) {
    return window.screen.orientation.type.includes('landscape') ? 'landscape' : 'portrait'
  }

  // 降级方案：通过宽高比判断
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
}

/**
 * 获取设备上下文信息
 */
const getDeviceContext = (ua: string): DeviceContext => {
  const screen = window.screen || { width: 0, height: 0, colorDepth: 24 }

  return {
    type: detectDeviceType(ua),
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenResolution: `${screen.width}x${screen.height}`,
    pixelRatio: window.devicePixelRatio || 1,
    orientation: getOrientation(),
    viewportWidth: window.innerWidth || 0,
    viewportHeight: window.innerHeight || 0,
    colorDepth: screen.colorDepth || 24,
    touchPoints: navigator.maxTouchPoints || 0,
  }
}

/**
 * 获取页面上下文信息
 */
const getPageContext = (): PageContext => {
  const { href, pathname, search, hash } = window.location

  return {
    url: href,
    path: pathname,
    query: search,
    hash,
    title: document.title || '',
    referrer: document.referrer || '',
  }
}

/**
 * 获取网络上下文信息
 */
const getNetworkContext = (): NetworkContext => {
  const connection = navigator.connection

  const context: NetworkContext = {
    online: navigator.onLine,
  }

  // Network Information API 可能不被支持
  if (connection) {
    if (connection.effectiveType) {
      context.effectiveType = connection.effectiveType
    }
    if (typeof connection.downlink === 'number') {
      context.downlink = connection.downlink
    }
    if (typeof connection.rtt === 'number') {
      context.rtt = connection.rtt
    }
  }

  return context
}

/**
 * 获取完整的浏览器环境信息
 *
 * @returns 包含浏览器、操作系统、设备、页面、网络等上下文的完整信息
 *
 * @example
 * ```ts
 * const info = getBrowserInfo()
 * console.log(info.browser.name) // "Chrome"
 * console.log(info.os.name)      // "macOS"
 * console.log(info.device.type)  // "desktop"
 * ```
 */
export const getBrowserInfo = (): BrowserInfo => {
  const ua = navigator.userAgent

  return {
    browser: parseBrowser(ua),
    os: parseOS(ua),
    device: getDeviceContext(ua),
    page: getPageContext(),
    network: getNetworkContext(),
    language: navigator.language || 'unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    timestamp: Date.now(),
    userAgent: ua,
  }
}

import type { BrowserContext, OSContext } from './types'

/**
 * 从 User-Agent 字符串解析浏览器信息
 * 使用正则匹配主流浏览器的特征字符串
 */
export function parseBrowser(ua: string): BrowserContext {
  const lowerUA = ua.toLowerCase()

  // 浏览器检测规则（顺序很重要，需要先检测特殊浏览器）
  const browserRules: Array<{ name: string; pattern: RegExp }> = [
    // 国产浏览器优先检测
    { name: 'MicroMessenger', pattern: /micromessenger\/([\d.]+)/ },
    { name: 'QQBrowser', pattern: /qqbrowser\/([\d.]+)/ },
    { name: 'UCBrowser', pattern: /ucbrowser\/([\d.]+)/ },
    { name: 'Baidu', pattern: /baidu.*\/([\d.]+)/ },
    // Edge 需要在 Chrome 之前检测（新版 Edge 基于 Chromium）
    { name: 'Edge', pattern: /edg(?:e|a|ios)?\/([\d.]+)/ },
    // Opera 需要在 Chrome 之前检测
    { name: 'Opera', pattern: /(?:opr|opera)\/([\d.]+)/ },
    // Chrome 需要在 Safari 之前检测
    { name: 'Chrome', pattern: /chrome\/([\d.]+)/ },
    // Firefox
    { name: 'Firefox', pattern: /firefox\/([\d.]+)/ },
    // Safari 最后检测（很多浏览器都包含 Safari 字符串）
    { name: 'Safari', pattern: /version\/([\d.]+).*safari/ },
    // IE
    { name: 'IE', pattern: /(?:msie |rv:)([\d.]+)/ },
  ]

  for (const { name, pattern } of browserRules) {
    const match = lowerUA.match(pattern)
    if (match) {
      return { name, version: match[1] || 'unknown' }
    }
  }

  return { name: 'unknown', version: 'unknown' }
}

/**
 * 从 User-Agent 字符串解析操作系统信息
 */
export function parseOS(ua: string): OSContext {
  const lowerUA = ua.toLowerCase()

  // Windows 版本映射
  const windowsVersionMap: Record<string, string> = {
    '10.0': '10/11',
    '6.3': '8.1',
    '6.2': '8',
    '6.1': '7',
    '6.0': 'Vista',
    '5.1': 'XP',
  }

  // iOS 检测
  const iosMatch = ua.match(/(?:iphone|ipad|ipod).*os ([\d_]+)/i)
  if (iosMatch?.[1]) {
    return { name: 'iOS', version: iosMatch[1].replace(/_/g, '.') }
  }

  // Android 检测
  const androidMatch = ua.match(/android ([\d.]+)/i)
  if (androidMatch?.[1]) {
    return { name: 'Android', version: androidMatch[1] }
  }

  // macOS 检测
  const macMatch = ua.match(/mac os x ([\d_]+)/i)
  if (macMatch?.[1]) {
    return { name: 'macOS', version: macMatch[1].replace(/_/g, '.') }
  }

  // Windows 检测
  const winMatch = ua.match(/windows nt ([\d.]+)/i)
  if (winMatch?.[1]) {
    const ntVersion = winMatch[1]
    const version = windowsVersionMap[ntVersion] ?? ntVersion
    return { name: 'Windows', version }
  }

  // Linux 检测
  if (lowerUA.includes('linux')) {
    return { name: 'Linux', version: 'unknown' }
  }

  return { name: 'unknown', version: 'unknown' }
}

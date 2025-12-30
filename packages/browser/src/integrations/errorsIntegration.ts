import { createEnvelope, Transport } from '@sunshine-monitor/core'

/**
 * 错误类型枚举
 * 用于区分不同来源的错误，便于后续分析和处理
 */
export enum ErrorType {
  /** JavaScript 运行时错误 */
  JS_ERROR = 'js_error',
  /** Promise 未捕获的 rejection */
  UNHANDLED_REJECTION = 'unhandled_rejection',
  /** 资源加载错误（图片、脚本等） */
  RESOURCE_ERROR = 'resource_error',
}

/**
 * 错误上报的数据结构
 * 包含错误的完整上下文信息，便于问题定位和分析
 */
export interface ErrorPayload {
  /** 错误类型标识 */
  errorType: ErrorType
  /** 错误名称（如 TypeError, ReferenceError 等） */
  name: string
  /** 错误描述信息 */
  message: string
  /** 错误堆栈信息，用于定位问题 */
  stack?: string
  /** 错误发生的文件路径 */
  filename?: string
  /** 错误发生的行号 */
  lineno?: number
  /** 错误发生的列号 */
  colno?: number
  /** 当前页面路径 */
  pageUrl: string
  /** 错误发生的时间戳 */
  timestamp: number
}

/**
 * 错误集成插件配置选项
 */
export interface ErrorsIntegrationOptions {
  /** 是否捕获 JS 运行时错误，默认 true */
  captureJsErrors?: boolean
  /** 是否捕获未处理的 Promise rejection，默认 true */
  captureUnhandledRejections?: boolean
  /** 是否捕获资源加载错误，默认 true */
  captureResourceErrors?: boolean
  /** 错误过滤函数，返回 false 则不上报该错误 */
  beforeSend?: (payload: ErrorPayload) => ErrorPayload | null
}

/**
 * 默认配置
 */
const DEFAULT_OPTIONS: Required<Omit<ErrorsIntegrationOptions, 'beforeSend'>> = {
  captureJsErrors: true,
  captureUnhandledRejections: true,
  captureResourceErrors: true,
}

/**
 * 错误监控集成插件
 *
 * 功能：
 * 1. 捕获全局 JS 运行时错误（window.onerror）
 * 2. 捕获未处理的 Promise rejection（window.onunhandledrejection）
 * 3. 捕获资源加载错误（通过 error 事件捕获阶段）
 *
 * 使用示例：
 * ```typescript
 * const errors = new ErrorsIntegration(transport, {
 *   captureJsErrors: true,
 *   captureUnhandledRejections: true,
 *   beforeSend: (payload) => {
 *     // 过滤掉某些不需要上报的错误
 *     if (payload.message.includes('Script error')) return null
 *     return payload
 *   }
 * })
 * errors.init()
 * ```
 */
export class ErrorsIntegration {
  /** 插件名称标识 */
  public readonly name = 'ErrorsIntegration'

  /** 合并后的配置 */
  private options: Required<Omit<ErrorsIntegrationOptions, 'beforeSend'>> & Pick<ErrorsIntegrationOptions, 'beforeSend'>

  /** 保存原始的事件处理器，用于卸载时恢复 */
  private originalOnError: OnErrorEventHandler | null = null
  private originalOnUnhandledRejection: ((event: PromiseRejectionEvent) => void) | null = null

  constructor(
    private transport: Transport,
    options: ErrorsIntegrationOptions = {}
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  /**
   * 初始化错误监控
   * 根据配置注册相应的错误捕获处理器
   */
  public init(): void {
    // 配置项与对应处理器的映射
    const handlers = new Map<keyof typeof this.options, () => void>([
      ['captureJsErrors', () => this.setupJsErrorHandler()],
      ['captureUnhandledRejections', () => this.setupUnhandledRejectionHandler()],
      ['captureResourceErrors', () => this.setupResourceErrorHandler()],
    ])

    handlers.forEach((setup, option) => {
      if (this.options[option]) {
        setup()
      }
    })
  }

  /**
   * 卸载错误监控
   * 移除所有事件监听器，恢复原始状态
   */
  public destroy(): void {
    // 恢复原始的 onerror 处理器
    window.onerror = this.originalOnError

    // 恢复原始的 onunhandledrejection 处理器
    if (this.originalOnUnhandledRejection) {
      window.onunhandledrejection = this.originalOnUnhandledRejection
    }

    // 移除资源错误监听器
    window.removeEventListener('error', this.handleResourceError, true)
  }

  /**
   * 设置 JS 运行时错误处理器
   * 通过 window.onerror 捕获同步代码中的未捕获错误
   */
  private setupJsErrorHandler(): void {
    // 保存原始处理器
    this.originalOnError = window.onerror

    window.onerror = (message, source, lineno, colno, error) => {
      const payload = this.createErrorPayload({
        errorType: ErrorType.JS_ERROR,
        name: error?.name || 'Error',
        message: typeof message === 'string' ? message : 'Unknown error',
        stack: error?.stack,
        filename: source || undefined,
        lineno: lineno || undefined,
        colno: colno || undefined,
      })

      this.reportError(payload)

      // 调用原始处理器，保持原有行为
      if (typeof this.originalOnError === 'function') {
        return this.originalOnError(message, source, lineno, colno, error)
      }

      // 返回 false 让错误继续传播到控制台
      return false
    }
  }

  /**
   * 设置未处理的 Promise rejection 处理器
   * 捕获异步代码中未被 catch 的 Promise 错误
   */
  private setupUnhandledRejectionHandler(): void {
    // 保存原始处理器
    this.originalOnUnhandledRejection = window.onunhandledrejection

    window.onunhandledrejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason

      // 提取错误信息，reason 可能是 Error 对象或其他类型
      const payload = this.createErrorPayload({
        errorType: ErrorType.UNHANDLED_REJECTION,
        name: reason?.name || 'UnhandledRejection',
        message: this.extractErrorMessage(reason),
        stack: reason?.stack,
      })

      this.reportError(payload)

      // 调用原始处理器
      if (typeof this.originalOnUnhandledRejection === 'function') {
        this.originalOnUnhandledRejection(event)
      }
    }
  }

  /**
   * 设置资源加载错误处理器
   * 通过捕获阶段监听 error 事件，捕获图片、脚本等资源加载失败
   */
  private setupResourceErrorHandler(): void {
    window.addEventListener('error', this.handleResourceError, true)
  }

  /**
   * 资源错误处理函数
   * 使用箭头函数保持 this 绑定，便于移除监听器
   */
  private handleResourceError = (event: ErrorEvent): void => {
    const target = event.target as HTMLElement | null

    // 只处理资源加载错误（有 src 或 href 属性的元素）
    if (!target || !this.isResourceElement(target)) {
      return
    }

    const resourceUrl = this.getResourceUrl(target)

    const payload = this.createErrorPayload({
      errorType: ErrorType.RESOURCE_ERROR,
      name: 'ResourceLoadError',
      message: `Failed to load ${target.tagName.toLowerCase()}: ${resourceUrl}`,
      filename: resourceUrl,
    })

    this.reportError(payload)
  }

  /**
   * 创建错误上报数据
   * 补充通用字段（页面路径、时间戳等）
   */
  private createErrorPayload(
    partial: Partial<ErrorPayload> & Pick<ErrorPayload, 'errorType' | 'name' | 'message'>
  ): ErrorPayload {
    return {
      ...partial,
      pageUrl: window.location.href,
      timestamp: Date.now(),
    }
  }

  /**
   * 上报错误
   * 应用过滤函数后，通过 transport 发送数据
   */
  private reportError(payload: ErrorPayload): void {
    // 应用 beforeSend 过滤
    let finalPayload: ErrorPayload | null = payload
    if (this.options.beforeSend) {
      finalPayload = this.options.beforeSend(payload)
    }

    // 如果被过滤掉则不上报
    if (!finalPayload) {
      return
    }

    // 使用 createEnvelope 创建符合规范的数据结构
    const envelope = createEnvelope('event', finalPayload)

    // 发送数据，捕获发送过程中的错误避免死循环
    this.transport.send(envelope).catch(() => {
      // 静默处理发送失败，避免触发新的错误上报导致死循环
    })
  }

  /**
   * 从 reason 中提取错误信息
   * reason 可能是 Error 对象、字符串或其他类型
   */
  private extractErrorMessage(reason: unknown): string {
    if (reason instanceof Error) {
      return reason.message
    }
    if (typeof reason === 'string') {
      return reason
    }
    // 尝试转换为字符串
    try {
      return String(reason)
    } catch {
      return 'Unknown rejection reason'
    }
  }

  /**
   * 判断元素是否为资源元素
   */
  private isResourceElement(target: HTMLElement): boolean {
    const tagName = target.tagName.toLowerCase()
    return ['img', 'script', 'link', 'audio', 'video', 'source'].includes(tagName)
  }

  /**
   * 获取资源元素的 URL
   */
  private getResourceUrl(target: HTMLElement): string {
    if ('src' in target) {
      return (target as HTMLImageElement | HTMLScriptElement).src || ''
    }
    if ('href' in target) {
      return (target as HTMLLinkElement).href || ''
    }
    return ''
  }
}

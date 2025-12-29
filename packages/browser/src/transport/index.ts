import { getBrowserInfo } from '@sunshine-monitor/browser-utils'
import { Envelope, Transport, TransportResponse } from '@sunshine-monitor/core'

/**
 * 浏览器端 Transport 实现
 * 使用 fetch API 发送数据到服务端
 */
export class BrowserTransport implements Transport {
  private baseUrl = 'http://localhost:3004/dsn-server'

  constructor(private dsn: string) {}

  /**
   * 发送 Envelope 数据到服务端
   */
  async send(envelope: Envelope): Promise<TransportResponse> {
    const browserInfo = getBrowserInfo()

    const payload = {
      ...envelope,
      browserInfo,
    }

    console.log('payload', payload)

    console.log('BrowserTransport sending:', payload)

    try {
      const response = await fetch(`${this.baseUrl}/span/tracking/${this.dsn}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      return {
        statusCode: response.status,
        headers: {
          'x-rate-limit': response.headers.get('X-Rate-Limit'),
          'retry-after': response.headers.get('Retry-After'),
        },
      }
    } catch (err) {
      console.error('Failed to send data:', err)
      return { statusCode: 0 }
    }
  }

  /**
   * 刷新缓冲区（当前实现无缓冲，直接返回 true）
   */
  async flush(): Promise<boolean> {
    return true
  }
}

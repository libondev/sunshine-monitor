import { ClickHouseClient } from '@clickhouse/client'
import { Inject, Injectable } from '@nestjs/common'

import { CLICKHOUSE_CLIENT } from '../fundamentals/clickhouse'
import { MonitorEventRow, TrackingParams } from './dto'

@Injectable()
export class SpanService {
  @Inject(CLICKHOUSE_CLIENT)
  private readonly clickhouseClient: ClickHouseClient

  /**
   * 追踪事件并写入 ClickHouse
   * @param appId - 应用 ID (DSN)
   * @param params - Envelope 数据
   * @param clientIp - 客户端 IP（可选）
   */
  async tracking(appId: string, params: TrackingParams, clientIp?: string) {
    const { header, items, browserInfo } = params

    // 将客户端时间戳转换为 ClickHouse DateTime64 格式 (YYYY-MM-DD HH:mm:ss.SSS)
    const date = new Date(header.timestamp)
    const clientTimestamp = date.toISOString().replace('T', ' ').replace('Z', '')

    // 构建插入数据，每个 item 对应一条记录
    const rows: MonitorEventRow[] = items.map(item => ({
      app_id: appId,
      event_type: header.type,
      timestamp: clientTimestamp,
      sdk_version: header.sdk_version ?? '',
      payload: item.payload ?? {},
      browser_info: browserInfo ?? {},
      client_ip: clientIp ?? '',
    }))

    console.log('Inserting monitor events:', rows)

    await this.clickhouseClient.insert({
      table: 'monitor_events',
      values: rows,
      format: 'JSONEachRow',
    })

    return { success: true, count: rows.length }
  }
}

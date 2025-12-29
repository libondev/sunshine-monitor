import { registerAs } from '@nestjs/config'

// ClickHouse 数据库配置
export interface ClickhouseConfig {
  url: string
  username: string
  password: string
}

// 应用基础配置
export interface AppConfig {
  prefix: string
  port: number
}

// 全局配置类型，用于 ConfigService 类型提示
export interface GlobalConfig {
  app: AppConfig
  clickhouse: ClickhouseConfig
}

export const APP_CONFIG_KEY = 'app'
export const CLICKHOUSE_CONFIG_KEY = 'clickhouse'

export const appConfig = registerAs(
  APP_CONFIG_KEY,
  (): AppConfig => ({
    prefix: process.env.PREFIX ?? '/dsn-server',
    port: parseInt(process.env.PORT ?? '3004', 10),
  })
)

export const clickhouseConfig = registerAs(
  CLICKHOUSE_CONFIG_KEY,
  (): ClickhouseConfig => ({
    url: process.env.CLICKHOUSE_URL ?? '',
    username: process.env.CLICKHOUSE_USERNAME ?? '',
    password: process.env.CLICKHOUSE_PASSWORD ?? '',
  })
)

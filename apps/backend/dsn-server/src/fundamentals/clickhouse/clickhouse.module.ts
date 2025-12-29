import { createClient } from '@clickhouse/client'
import { DynamicModule, Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { CLICKHOUSE_CONFIG_KEY, ClickhouseConfig } from '../../config'
import { CLICKHOUSE_CLIENT } from './clickhouse.constants'

export interface ClickhouseModuleOptions {
  url: string
  username: string
  password: string
}

@Global()
@Module({})
export class ClickhouseModule {
  static forRoot(options: ClickhouseModuleOptions): DynamicModule {
    return {
      module: ClickhouseModule,
      providers: [
        {
          provide: CLICKHOUSE_CLIENT,
          useFactory() {
            return createClient(options)
          },
        },
      ],
      exports: [CLICKHOUSE_CLIENT],
    }
  }

  static forRootAsync(): DynamicModule {
    return {
      module: ClickhouseModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: CLICKHOUSE_CLIENT,
          inject: [ConfigService],
          useFactory(configService: ConfigService) {
            const config = configService.get<ClickhouseConfig>(CLICKHOUSE_CONFIG_KEY)
            if (!config) {
              throw new Error('ClickHouse 配置未找到，请检查环境变量')
            }
            return createClient({
              url: config.url,
              username: config.username,
              password: config.password,
            })
          },
        },
      ],
      exports: [CLICKHOUSE_CLIENT],
    }
  }
}

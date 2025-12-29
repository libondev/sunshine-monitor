import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { appConfig, clickhouseConfig } from './config'
import { ClickhouseModule } from './fundamentals/clickhouse'
import { SpanModule } from './span/span.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, clickhouseConfig],
    }),
    ClickhouseModule.forRootAsync(),
    SpanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

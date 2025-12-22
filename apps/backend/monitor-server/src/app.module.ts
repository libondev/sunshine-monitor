import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule, JwtAuthGuard } from './auth'
import { loadConfig } from './config'
import { PrismaModule } from './prisma'
import { ResponseInterceptor } from './response'
import { ResponseModule } from './response/response.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ResponseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局 JWT 认证守卫，所有接口默认需要认证
    // 使用 @Public() 装饰器可跳过认证
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局响应拦截器，统一响应格式
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}

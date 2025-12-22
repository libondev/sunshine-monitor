import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { ApiExceptionFilter } from '../common/filters/api-exception.filter'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)

  const prefix = configService.get('PREFIX')

  app.setGlobalPrefix(prefix)

  // 全局异常过滤器 - 统一响应格式
  app.useGlobalFilters(new ApiExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  await app.listen(process.env.PORT)
}
bootstrap()

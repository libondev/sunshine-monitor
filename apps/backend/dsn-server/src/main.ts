import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { type GlobalConfig } from './config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService<GlobalConfig, true>)

  const appConfig = configService.get('app', { infer: true })

  app.setGlobalPrefix(appConfig.prefix)

  app.enableCors()

  await app.listen(appConfig.port)
}
bootstrap()

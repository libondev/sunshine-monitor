import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { RESPONSE_MESSAGE_KEY } from './response-message.decorator'

/**
 * 统一响应格式接口
 */
export interface ApiResponse<T> {
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
}

/**
 * 全局响应拦截器
 * 统一包装所有成功响应为标准格式 { code, message, data }
 * 支持通过 @ResponseMessage() 装饰器自定义消息
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    // 从装饰器获取自定义消息，没有则使用默认值
    const message = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ?? '操作成功'

    // 统一设置 HTTP 状态码为 200
    const response = context.switchToHttp().getResponse()
    response.status(200)

    return next.handle().pipe(
      map(data => ({
        code: 200,
        message,
        data,
      }))
    )
  }
}

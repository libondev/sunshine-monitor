import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Response } from 'express'

import { ApiException } from '../exceptions/api.exception'

/**
 * 全局 API 异常过滤器
 * 将所有异常转换为统一的响应格式
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let code: number
    let message: string
    let httpStatus: number

    if (exception instanceof ApiException) {
      // 自定义 API 异常
      code = exception.getErrCode()
      message = exception.message
      httpStatus = exception.getStatus()
    } else if (exception instanceof HttpException) {
      // 其他 HTTP 异常
      httpStatus = exception.getStatus()
      code = httpStatus
      const exceptionResponse = exception.getResponse()
      message =
        typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || exception.message
    } else {
      // 未知异常
      httpStatus = 500
      code = 500
      message = '服务器内部错误'
      // 开发环境可以打印详细错误
      console.error('未捕获的异常:', exception)
    }

    response.status(httpStatus).json({
      code,
      message,
      data: null,
    })
  }
}

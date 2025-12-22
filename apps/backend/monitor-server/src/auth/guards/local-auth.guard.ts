import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiCode } from 'common/enums/api-code.enum'
import { ApiException } from 'common/exceptions/api.exception'

import { ResponseService } from '../../response/response.service'

/**
 * 本地认证守卫
 * 用于保护登录接口，触发 LocalStrategy 验证
 * 重写 handleRequest 以实现统一响应格式
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly responseService: ResponseService) {
    super()
  }

  /**
   * 处理认证请求
   * 捕获认证异常，返回统一格式响应而非 HTTP 异常
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // 认证失败：用户不存在或密码错误
    if (err || !user) {
      const request = context.switchToHttp().getResponse()
      console.log(request)
      console.log(info?.message)

      if (info?.message === 'Missing credentials') {
        throw new ApiException(ApiCode.PARAM_MISSING)
      }

      throw err || new ApiException(ApiCode.LOGIN_FAILED)
    }

    return user
  }
}

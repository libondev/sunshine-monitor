import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiCode } from 'common/enums/api-code.enum'
import { ApiException } from 'common/exceptions/api.exception'

import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

/**
 * JWT 认证守卫
 * 用于保护需要登录才能访问的接口
 * 支持通过 @Public() 装饰器跳过验证
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  /**
   * 判断是否可以激活路由
   * @param context - 执行上下文
   * @returns 是否允许访问
   */
  canActivate(context: ExecutionContext) {
    // 检查是否标记为公开接口
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }

  /**
   * 处理认证请求结果
   * @param err - 错误信息
   * @param user - 用户信息
   * @throws UnauthorizedException 当认证失败时
   */
  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw err || new ApiException(ApiCode.UNAUTHORIZED)
    }
    return user
  }
}

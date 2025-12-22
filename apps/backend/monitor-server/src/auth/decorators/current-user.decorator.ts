import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { User } from '../../user/entities/user.entity'

/**
 * 当前用户装饰器
 * 从请求中提取已认证的用户信息
 *
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user
 * }
 *
 * 获取特定字段
 * @Get('my-id')
 * getMyId(@CurrentUser('id') userId: number) {
 *   return userId
 * }
 * ```
 */
export const CurrentUser = createParamDecorator((data: keyof User | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user as User
  return data ? user?.[data] : user
})

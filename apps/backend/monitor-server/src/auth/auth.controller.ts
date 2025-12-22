import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { User } from '../user/entities/user.entity'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'

/**
 * 认证控制器
 * 处理 token 刷新等认证相关操作
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 刷新 token
   * @param user - 当前登录用户
   * @returns 新的 access_token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@CurrentUser() user: User) {
    return this.authService.refreshToken(user)
  }
}

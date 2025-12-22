import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { UserWithPassword } from '../../user/entities/user.entity'
import { AuthService } from '../auth.service'

/**
 * 本地认证策略
 * 用于处理用户名/密码登录验证
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    })
  }

  /**
   * 验证用户凭证
   * @param username - 用户名
   * @param password - 密码
   * @returns 验证通过的用户信息，失败返回 null（由 Guard 处理响应）
   */
  async validate(username: string, password: string): Promise<UserWithPassword | null> {
    return this.authService.validateUser(username, password)
  }
}

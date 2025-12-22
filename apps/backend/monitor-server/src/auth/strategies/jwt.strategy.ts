import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthService } from '../../auth/auth.service'
import { User } from '../../user/entities/user.entity'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

/**
 * JWT 认证策略
 * 用于验证请求中的 JWT token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      // 从 Authorization Bearer token 中提取 JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间
      ignoreExpiration: false,
      // 使用配置中的密钥
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  /**
   * 验证 JWT 载荷并返回用户信息
   * @param payload - JWT 解码后的载荷
   * @returns 用户信息（不含密码）
   * @throws UnauthorizedException 当用户不存在时
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUserById(payload.sub)
    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用')
    }
    return user
  }
}

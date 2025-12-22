import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ApiCode } from 'common/enums/api-code.enum'
import { ApiException } from 'common/exceptions/api.exception'

import { PrismaService } from '../prisma'
import { User, UserWithPassword } from '../user/entities/user.entity'
import { JwtPayload } from './interfaces/jwt-payload.interface'

/**
 * 认证服务
 * 处理用户登录验证和 JWT token 生成
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 验证用户凭证
   * @param username - 用户名
   * @param password - 明文密码
   * @returns 验证成功返回用户信息，失败返回 null
   */
  async validateUser(username: string, password: string): Promise<UserWithPassword | null> {
    console.log('21312312321312312')

    const user = await this.prisma.user.findFirst({
      where: { username },
    })

    if (!user) {
      throw new ApiException(ApiCode.LOGIN_FAILED)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return null
    }

    return user
  }

  /**
   * 通过用户 ID 验证用户是否存在
   * @param userId - 用户 ID
   * @returns 用户信息（不含密码）
   */
  async validateUserById(userId: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * 刷新 token（可选功能）
   * @param user - 当前用户
   * @returns 新的 access_token
   */
  async refreshToken(user: User): Promise<{ accessToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}

import { ConflictException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { Prisma } from '@/generated/prisma/client'

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface'
import { PrismaService } from '../prisma'
import { CreateUserDto } from './dto/create-user.dto'
import { ResLoginDto } from './dto/res-login.dto'
import { User, UserWithPassword } from './entities/user.entity'

/** bcrypt 加密轮数，值越大越安全但性能开销也越大 */
const SALT_ROUNDS = 10

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 创建新用户
   * @param createUserDto - 用户创建数据
   * @returns 创建的用户（不含密码）
   * @throws ConflictException 当邮箱或用户名已存在时
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查是否存在相同的用户名或邮箱
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { username: createUserDto.username }],
      },
    })

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('邮箱已经存在')
      }
      throw new ConflictException('用户名已经存在')
    }

    // 使用 bcrypt 加密密码
    const hashedPassword = await this.hashPassword(createUserDto.password)

    const data: Prisma.UserCreateInput = {
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      phone: createUserDto.phone ?? '',
      role: createUserDto.role ?? 'user',
    }

    const user = await this.prisma.user.create({ data })

    return this.excludePassword(user)
  }

  /**
   * 用户登录，生成 JWT token
   * @param user - 已验证的用户信息
   * @returns 包含 accessToken 和用户信息的对象
   */
  async login(user: UserWithPassword): Promise<ResLoginDto> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      user: this.excludePassword(user),
    }
  }

  /**
   * 获取所有用户列表
   * @returns 用户数组（不含密码）
   */
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany()
    return users.map(user => this.excludePassword(user))
  }

  /**
   * 使用 bcrypt 对密码进行加密
   * @param password - 原始密码
   * @returns 加密后的密码哈希值
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  /**
   * 从用户对象中排除密码字段
   * @param user - 包含密码的用户对象
   * @returns 不含密码的用户对象
   */
  private excludePassword(user: {
    id: number
    email: string
    username: string
    password: string
    phone: string
    role: string
  }): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

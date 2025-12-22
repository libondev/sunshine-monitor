import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'

import { CurrentUser, LocalAuthGuard, Public } from '../auth'
import { CreateUserDto } from './dto/create-user.dto'
import { ReqLoginDto } from './dto/req-login.dto'
import { User, UserWithPassword } from './entities/user.entity'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 用户注册
   * @param createUserDto - 用户注册数据
   * @returns 创建的用户信息
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  /**
   * 用户登录
   * @param _reqLoginDto - 登录请求数据（由 LocalAuthGuard 处理验证）
   * @param user - 经过 LocalAuthGuard 验证的用户
   * @returns JWT token 和用户信息
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() _reqLoginDto: ReqLoginDto, @CurrentUser() user: UserWithPassword) {
    return this.userService.login(user)
  }

  /**
   * 获取当前登录用户信息
   * @param user - 当前登录用户
   * @returns 用户信息
   */
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user
  }

  /**
   * 获取所有用户列表
   * @returns 用户数组
   */
  @Get('list')
  findAll(): Promise<User[]> {
    return this.userService.findAll()
  }
}

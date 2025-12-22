import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

/**
 * 用户登录数据传输对象
 */
export class ReqLoginDto {
  /** 用户名 */
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  /** 密码，最少 6 位 */
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于 6 位' })
  @MaxLength(16, { message: '密码长度不能超过 16 位' })
  password: string
}

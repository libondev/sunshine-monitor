import { User } from '../entities/user.entity'

/**
 * 登录响应数据传输对象
 */
export class ResLoginDto {
  /** JWT 访问令牌 */
  accessToken: string
  /** 用户信息（不含密码） */
  user: User
}

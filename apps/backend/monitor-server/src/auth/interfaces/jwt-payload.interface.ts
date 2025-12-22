/**
 * JWT 载荷接口
 * 定义 token 中存储的用户信息
 */
export interface JwtPayload {
  /** 用户 ID */
  sub: number
  /** 用户名 */
  username: string
  /** 用户角色 */
  role: string
  /** 签发时间（由 JWT 自动添加） */
  iat?: number
  /** 过期时间（由 JWT 自动添加） */
  exp?: number
}

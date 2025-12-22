export enum BusinessCode {
  // 通用成功
  SUCCESS = 200,

  // 客户端请求错误 (400 系列)
  BAD_REQUEST = 400,
  PARAMETER_MISSING = 40001,
  PARAMETER_INVALID = 40002,

  // 登录相关 (401 系列)
  UNAUTHORIZED = 40100,
  LOGIN_FAILED = 40101, // 用户名或密码错误
  TOKEN_EXPIRED = 40102, // Token 过期
  TOKEN_INVALID = 40103, // Token 无效

  // 权限与状态 (403 系列)
  FORBIDDEN = 40300,
  ACCOUNT_LOCKED = 40301, // 账号被封禁
  PERMISSION_DENIED = 40302, // 权限不足

  // 注册与资源冲突 (409 系列)
  RESOURCE_CONFLICT = 40900,
  USER_ALREADY_EXISTS = 40901, // 用户名已存在
  EMAIL_ALREADY_EXISTS = 40902, // 邮箱已占用
  PHONE_ALREADY_EXISTS = 40903, // 手机号已占用

  // 系统错误 (500 系列)
  INTERNAL_SERVER_ERROR = 50000,
}

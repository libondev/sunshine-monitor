export enum ApiCode {
  /** 成功 */
  SUCCESS = 20000,

  /** 客户端错误：参数类 */
  PARAM_MISSING = 40001, // 参数缺失
  PARAM_INVALID = 40002, // 参数格式不合法

  /** 客户端错误：认证类 */
  UNAUTHORIZED = 40100, // 未登录
  LOGIN_FAILED = 40101, // 登录失败(用户名或密码错误)
  TOKEN_EXPIRED = 40102, // Token 已过期
  TOKEN_INVALID = 40103, // Token 无效

  /** 客户端错误：权限类 */
  FORBIDDEN = 40300, // 无权限访问
  ACCOUNT_LOCKED = 40301, // 账号被封禁

  /** 客户端错误：资源冲突类 */
  RESOURCE_NOT_FOUND = 40400, // 资源不存在
  USER_ALREADY_EXISTS = 40901, // 用户已存在
  PHONE_ALREADY_EXISTS = 40902, // 手机号已占用

  /** 服务端错误 */
  INTERNAL_SERVER_ERROR = 50000, // 服务器内部错误
}

// 建立 Code 到 Message 的映射
export const ApiMessage: Record<ApiCode, string> = {
  [ApiCode.SUCCESS]: '操作成功',
  [ApiCode.PARAM_MISSING]: '请求参数缺失',
  [ApiCode.PARAM_INVALID]: '参数格式不正确',
  [ApiCode.UNAUTHORIZED]: '未登录',
  [ApiCode.LOGIN_FAILED]: '用户名或密码不正确',
  [ApiCode.TOKEN_EXPIRED]: 'Token 已过期，请重新登录',
  [ApiCode.TOKEN_INVALID]: 'Token 无效',
  [ApiCode.FORBIDDEN]: '无权限访问该资源',
  [ApiCode.ACCOUNT_LOCKED]: '账号已被封禁',
  [ApiCode.RESOURCE_NOT_FOUND]: '请求的资源不存在',
  [ApiCode.USER_ALREADY_EXISTS]: '该账号已被注册',
  [ApiCode.PHONE_ALREADY_EXISTS]: '该手机号已被占用',
  [ApiCode.INTERNAL_SERVER_ERROR]: '服务器开小差了，请稍后再试',
}

import { SetMetadata } from '@nestjs/common'

/** 公开接口元数据键 */
export const IS_PUBLIC_KEY = 'isPublic'

/**
 * 公开接口装饰器
 * 标记的接口不需要 JWT 认证即可访问
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('health')
 * healthCheck() {
 *   return { status: 'ok' }
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

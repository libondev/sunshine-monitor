export const loadConfig = () => {
  return {
    port: '3003',
    prefix: process.env.PREFIX,
    jwt: {
      /** JWT 签名密钥，生产环境务必使用强密钥 */
      secret: process.env.JWT_SECRET,
      /** Token 过期时间 */
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  }
}

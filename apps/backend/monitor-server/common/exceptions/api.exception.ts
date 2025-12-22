import { HttpException } from '@nestjs/common'
import { ApiCode, ApiMessage } from 'common/enums/api-code.enum'

export class ApiException extends HttpException {
  private errCode: ApiCode
  constructor(errCode: ApiCode, msg?: string) {
    const errMessage = msg ?? ApiMessage[errCode]
    super(errMessage, 200)
    this.errCode = errCode
  }
  getErrCode(): number {
    return this.errCode
  }
}

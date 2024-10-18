export class BaseResponse {
  code: string
  data?: any
  message: string
  cause?: any

  constructor(code: string, message: string, data?: any, cause?: any) {
    this.code = code
    this.data = data
    this.message = message
    this.cause = cause
  }

}
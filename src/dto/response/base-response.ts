export class BaseResponse {
  code: string
  data?: any
  message: string
  cause?: string

  constructor(code: string, message: string, data?: any, cause?: string) {
    this.code = code
    this.data = data
    this.message = message
    this.cause = cause
  }

}
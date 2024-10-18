import { HttpException, HttpStatus } from '@nestjs/common'

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public errorCode?: string,
  ) {
    super(message, statusCode)
  }
}
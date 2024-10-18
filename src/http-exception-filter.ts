import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import * as dotenv from 'dotenv'
import { BaseException } from './exception/base.exception'
import { BaseResponse } from 'src/dto/response/base.response'
dotenv.config()

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus()

    const baseException = exception as BaseException
    const cause = baseException.cause || null

    const baseResponse: BaseResponse = {
      code: baseException.errorCode || 'ERR000',
      data: null,
      message: baseException.message,
      cause: process.env.NODE_ENV !== 'production' ? cause : null,
    }

    response.status(status).json(baseResponse)

  }
}
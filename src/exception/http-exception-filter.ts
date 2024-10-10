import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import * as dotenv from 'dotenv'
dotenv.config()

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus()

    if (status == 500) {
      response.status(status).json({
        code: "ERR000",
        data: null,
        cause: exception.cause,
        message: exception.message,
      })
    } else {
      response.status(status).json({
        code: "BAD000",
        data: null,
        cause: process.env.JWT_SECRET != "production" ? exception.getResponse()["message"][0] : null,
        message: exception.message,
      })
    }
  }
}
import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'

export class InvalidTokenVerifyException extends BaseException {
  constructor() {
    super('Verify token error.', HttpStatus.UNAUTHORIZED, 'AUTH003')
  }
}
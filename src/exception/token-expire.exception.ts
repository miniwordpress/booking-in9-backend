import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'

export class TokenExpireException extends BaseException {
  constructor() {
    super('Token expired.', HttpStatus.UNAUTHORIZED, 'AUTH002')
  }
}
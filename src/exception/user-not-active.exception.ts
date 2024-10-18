import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'

export class UserNotActiveException extends BaseException {
  constructor() {
    super('Sign in failed because status not active', HttpStatus.UNAUTHORIZED, 'AUTH004')
  }
}
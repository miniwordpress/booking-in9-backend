import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'

export class SignInFailedException extends BaseException {
  constructor() {
    super('Invalid email or password', HttpStatus.UNAUTHORIZED, 'AUTH005')
  }
}
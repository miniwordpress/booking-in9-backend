import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'

export class WeakPasswordException extends BaseException {
  constructor() {
    super(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      HttpStatus.BAD_REQUEST,
      'PSS001'
    )
  }
}
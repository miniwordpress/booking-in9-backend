import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'

export class EmailExistingException extends BaseException {
  constructor() {
    super('Email is already in use.', HttpStatus.BAD_REQUEST, 'USR002')
  }
}
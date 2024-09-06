import { Body, Controller, Get, Post, Res, HttpStatus, HttpException } from '@nestjs/common'
import { loginRequest } from 'src/dto/mock/request/loginRequest'
import { loginResponse } from 'src/dto/mock/response/loginResponse'
import { Response } from 'express'

@Controller('mock')
export class MockUpController {
  constructor() { }

  @Post('login')
  check(@Body() loginDto: loginRequest, @Res() res: Response): Response<loginResponse> {
    const { email, password } = loginDto
    if (email == null && password == null) throw new HttpException('Please fill input', HttpStatus.BAD_REQUEST)
    if (email == "test@test.com" && password == "1234567") {
      return res.status(HttpStatus.OK).json({ token: "XXXX_TOKEN_PASS" })
    } else {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }
  }
}
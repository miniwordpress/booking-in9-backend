import { Controller, Post, HttpStatus, Body, Res, Req, Headers, Get, ForbiddenException, Param, UseInterceptors, BadRequestException, Put, Delete } from '@nestjs/common'
import { Response, Request } from 'express'
import { UsersService } from '../service/users.service'
import { CreateUserRequest } from '../dto/models/request/create-user.request'
import { BaseResponse } from 'src/dto/response/base.response'
import { VerifyUserRequest } from 'src/dto/models/request/verify-user.request'
import { Public } from 'src/auth/auth.guard'
import { ForgotPasswordRequest } from 'src/dto/models/request/forgot-password.request'
import { ResetPasswordRequest } from 'src/dto/models/request/reset-password.request'
import { Language } from 'src/utils/language.decorator'
import { UserContext } from 'src/dto/models/user-context'
import { User } from 'src/utils/user.decorator'
import { UsersRole } from 'src/enum/users-role'
import { AdminRoleInterceptor } from 'src/auth/role.interceptor'
import { UpdateUserRequest } from 'src/dto/models/request/update-user.request'
import validator from 'validator'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Public()
  @Post('create-user')
  async createUser(
    @Body() createUserRequest: CreateUserRequest,
    @Language() lang: string,
    @Res() res: Response<BaseResponse>) {
    var response: BaseResponse = {
      code: HttpStatus.CREATED.toString(),
      data: await this.userService.createUser(createUserRequest, lang),
      message: "Create user success",
      cause: null
    }
    return res.status(HttpStatus.CREATED).json(response)
  }

  @Public()
  @Post('verify')
  async verifyUser(
    @Body() verifyUserRequest: VerifyUserRequest,
    @Res() res: Response<BaseResponse>) {
    const response = await this.userService.verifyUsers(verifyUserRequest.token)
    res.status(HttpStatus.OK).json(new BaseResponse(
      "000",
      null,
      response,
      null
    ))
  }

  @Public()
  @Post("forgot-password")
  async forgotPassword(
    @Body() forgotPasswordRequest: ForgotPasswordRequest,
    @Language() lang: string,
    @Res() res: Response<BaseResponse>) {
    const { email } = forgotPasswordRequest
    this.userService.forgotPassword(email, lang)
    return res.status(HttpStatus.NO_CONTENT).json(new BaseResponse(
      "0000",
      null,
      email,
      null
    ))
  }

  @Public()
  @Post("reset-password")
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordRequest,
    @Language() lang: string,
    @Res() res: Response<BaseResponse>) {
    const response = await this.userService.resetPassword(resetPasswordRequest)
    return res.status(HttpStatus.OK).json(new BaseResponse(
      "0000",
      response,
      null,
      null
    ))
  }

  @Get()
  @UseInterceptors(AdminRoleInterceptor)
  async getAllUser(
    @Res() res: Response<BaseResponse>
  ) {
    return res.status(HttpStatus.OK).json(new BaseResponse(
      "0000",
      null,
      await this.userService.getAllUsers(),
      null
    ))
  }

  @Get(':id')
  @UseInterceptors(AdminRoleInterceptor)
  async getUser(
    @Param('id') id: number,
    @User() user: UserContext,
    @Res() res: Response<BaseResponse>
  ) {
    if (id == user.id) {
      throw new BadRequestException("Can't view yourself")
    }
    return res.status(HttpStatus.OK).json(new BaseResponse(
      "0000",
      null,
      await this.userService.getUser(id),
      null
    ))
  }

  @Put(':id')
  @UseInterceptors(AdminRoleInterceptor)
  async updateUser(
    @Param('id') id: number,
    @Body() updateUser: UpdateUserRequest,
    @User() user: UserContext,
    @Res() res: Response<BaseResponse>
  ) {
    if (id == user.id) {
      throw new BadRequestException("Can't update yourself")
    }
    return res.status(HttpStatus.OK).json(new BaseResponse(
      "0000",
      null,
      await this.userService.updateUser(id, updateUser),
      null
    ))
  }

  @Delete(':id')
  @UseInterceptors(AdminRoleInterceptor)
  async deleteUser(
    @Param('id') id: number,
    @User() user: UserContext,
    @Res() res: Response<BaseResponse>
  ) {
    if (id == user.id) {
      throw new BadRequestException("Can't delete your self")
    }
    await this.userService.deleteUser(id)
    return res.status(HttpStatus.OK).json(new BaseResponse(
      "0000",
      null,
      null,
      null
    ))
  }

}
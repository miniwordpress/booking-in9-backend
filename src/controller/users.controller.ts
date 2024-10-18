import { Controller, Post, HttpStatus, Body, Res, Req, Headers, Get, ForbiddenException, Param, UseInterceptors, BadRequestException } from '@nestjs/common'
import { Response, Request } from 'express'
import { UsersService } from '../service/users.service'
import { CreateUserRequest } from '../dto/models/request/create.user.request'
import { BaseResponse } from 'src/dto/response/base-response'
import { VerifyUserRequest } from 'src/dto/models/request/verify-user-request'
import { Public } from 'src/auth/auth.guard'
import { ForgotPasswordRequest } from 'src/dto/models/request/forgot.password.request'
import { ResetPasswordRequest } from 'src/dto/models/request/reset.password.request'
import { Language } from 'src/utils/language.decorator'
import { UserContext } from 'src/dto/models/user-context'
import { User } from 'src/utils/user.decorator'
import { UsersRole } from 'src/enum/users-role'
import { AdminRoleInterceptor } from 'src/auth/role.interceptor'

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
    @Language() lang: string,
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

  // @Patch('updateUserAccount')
  // async updateUser(@Body() updateUserDto: UpdateUserRequest): Promise<UsersAccountResponse> {
  //   var response = new UsersAccountResponse()

  //   if (updateUserDto == null) {
  //     response.code = HttpStatus.BAD_REQUEST.toString()
  //     response.data = null
  //     response.message = `updateUserDto null`
  //     response.cause = null

  //     throw new HttpException(response, HttpStatus.BAD_REQUEST)
  //   }

  //   try {
  //     const userData = await this.userService.updateUser(updateUserDto.id, updateUserDto)

  //     if (userData == null || userData == undefined) {
  //       response.code = HttpStatus.OK.toString()
  //       response.data = null
  //       response.message = `User id:${updateUserDto.id} not found`
  //       response.cause = null
  //       return response
  //     } else {
  //       let userAccountModel = new UserAccountModel()
  //       userAccountModel.id = userData.id
  //       userAccountModel.firstName = userData.first_name
  //       userAccountModel.lastName = userData.last_name
  //       userAccountModel.email = userData.email
  //       userAccountModel.password = userData.password
  //       userAccountModel.tel = userData.tel
  //       userAccountModel.idNumber = userData.id_number
  //       userAccountModel.img = userData.img
  //       userAccountModel.status = userData.status
  //       userAccountModel.role = userData.role
  //       userAccountModel.description = userData.description
  //       userAccountModel.createdAt = userData.created_at
  //       userAccountModel.updatedAt = userData.updated_at

  //       response.code = HttpStatus.OK.toString()
  //       response.data = [userAccountModel]
  //       response.message = "Success update user account"
  //       response.cause = null
  //       return response
  //     }
  //   } catch (error) {
  //     response.code = error.code
  //     response.data = null
  //     response.message = error.message
  //     response.cause = error.cause ?? null

  //     return response
  //   }
  // }

  // @Delete('deleteUserAccount')
  // async deleteUser(@Query('id') id: number): Promise<UsersAccountResponse> {
  //   var response = new UsersAccountResponse()

  //   if (id == null || id == undefined) {
  //     response.code = HttpStatus.BAD_REQUEST.toString()
  //     response.data = null
  //     response.message = `id null or undefined`
  //     response.cause = null

  //     throw new HttpException(response, HttpStatus.BAD_REQUEST)
  //   }

  //   try {
  //     await this.userService.deleteUser(BigInt(id))

  //     response.code = HttpStatus.OK.toString()
  //     response.data = null
  //     response.message = "Success delete user account"
  //     response.cause = null
  //     return response
  //   } catch (error) {
  //     response.code = error.code
  //     response.data = null
  //     response.message = error.message
  //     response.cause = error.cause ?? null

  //     return response
  //   }
  // }

}
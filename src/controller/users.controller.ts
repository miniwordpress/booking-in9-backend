import { Controller, Post, HttpStatus, Body, Res, Get, Param, UseInterceptors, BadRequestException, Put, Delete } from '@nestjs/common'
import { Response } from 'express'
import { UsersService } from '../service/users.service'
import { CreateUserRequest } from '../dto/request/create-user.request'
import { BaseResponse } from 'src/dto/response/base.response'
import { VerifyUserRequest } from 'src/dto/request/verify-user.request'
import { Public } from 'src/auth/auth.guard'
import { ForgotPasswordRequest } from 'src/dto/request/forgot-password.request'
import { ResetPasswordRequest } from 'src/dto/request/reset-password.request'
import { Language } from 'src/utils/language.decorator'
import { UserContext } from 'src/dto/models/user-context'
import { User } from 'src/utils/user.decorator'
import { AdminRoleInterceptor } from 'src/auth/role.interceptor'
import { UpdateUserRequest } from 'src/dto/request/update-user.request'
import { UsersResponse } from 'src/dto/response/users.response'
import { UserDeailResponse } from 'src/dto/response/user-detail.response'
import { UpdateProfileResponse } from 'src/dto/response/update-profile.response'
import { UpdateProfileRequest } from 'src/dto/request/update-profile.request'
import { ProfileResponse } from 'src/dto/response/profile.response'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Public()
  @Post('create-user')
  async createUser(
    @Body() createUserRequest: CreateUserRequest,
    @Language() lang: string,
    @Res() res: Response<BaseResponse<null>>) {
    var response: BaseResponse = {
      data: null,
      message: await this.userService.createUser(createUserRequest, lang),
    }
    return res.status(HttpStatus.CREATED).json(response)
  }

  @Public()
  @Post('verify')
  async verifyUser(
    @Body() verifyUserRequest: VerifyUserRequest,
    @Res() res: Response<BaseResponse<null>>) {
    const response: BaseResponse = {
      data: null,
      message: await this.userService.verifyUsers(verifyUserRequest.token),
    }
    res.status(HttpStatus.OK).json(response)
  }

  @Public()
  @Post("forgot-password")
  async forgotPassword(
    @Body() forgotPasswordRequest: ForgotPasswordRequest,
    @Language() lang: string,
    @Res() res: Response<BaseResponse<string>>) {
    const { email } = forgotPasswordRequest
    const response: BaseResponse = {
      data: null,
      message: await this.userService.forgotPassword(email, lang),
    }
    return res.status(HttpStatus.NO_CONTENT).json(response)
  }

  @Public()
  @Post("reset-password")
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordRequest,
    @Language() lang: string,
    @Res() res: Response<BaseResponse<string>>) {
    const response: BaseResponse = {
      data: null,
      message: await this.userService.resetPassword(resetPasswordRequest),
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Get()
  @UseInterceptors(AdminRoleInterceptor)
  async getAllUser(
    @Res() res: Response<BaseResponse<UsersResponse[]>>) {
    const response: BaseResponse = {
      data: await this.userService.getAllUsers(),
      message: null,
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Get('/profile')
  async profile(
    @User() user: UserContext,
    @Res() res: Response<BaseResponse<ProfileResponse>>
  ) {
    const response: BaseResponse = {
      data: await this.userService.getProfile(user.id),
      message: null,
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Put(':id')
  @UseInterceptors(AdminRoleInterceptor)
  async updateUser(
    @Param('id') id: number,
    @Body() updateUser: UpdateUserRequest,
    @User() user: UserContext,
    @Res() res: Response<BaseResponse<UserDeailResponse>>
  ) {
    if (id == user.id) {
      throw new BadRequestException("Can't update yourself")
    }
    const response: BaseResponse = {
      data: await this.userService.updateUser(id, updateUser),
      message: null,
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Delete(':id')
  @UseInterceptors(AdminRoleInterceptor)
  async deleteUser(
    @Param('id') id: number,
    @User() user: UserContext,
    @Res() res: Response<BaseResponse<void>>
  ) {
    if (id == user.id) {
      throw new BadRequestException("Can't delete your self")
    }
    await this.userService.deleteUser(id)
    const response: BaseResponse = {
      data: null,
      message: null,
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Post('/update-profile')
  async updateProfile(
    @Body() updateProfileRequest: UpdateProfileRequest,
    @User() user: UserContext,
    @Res() res: Response<BaseResponse<UpdateProfileResponse>>
  ) {
    const response: BaseResponse = {
      data: await this.userService.updateProfile(user.id, updateProfileRequest),
      message: null,
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Get(':id')
  @UseInterceptors(AdminRoleInterceptor)
  async getUser(
    @Param('id') id: number,
    @User() user: UserContext,
    @Res() res: Response<BaseResponse<UsersResponse>>) {
    if (id == user.id) {
      throw new BadRequestException("Can't view yourself")
    }
    const response: BaseResponse = {
      data: await this.userService.getUser(id),
      message: null,
    }
    return res.status(HttpStatus.OK).json(response)
  }

}
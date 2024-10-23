import { BadRequestException, Logger, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, HttpException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { User } from '../entity/user'
import { CreateUserRequest } from '../dto/request/create-user.request'
import encryptedPassword from '../utils/encrypted.password'
import { UpdateUserRequest } from 'src/dto/request/update-user.request'
import { Token } from 'src/entity/token'
import { AuthService } from './auth.service'
import { MailerService } from '@nestjs-modules/mailer'
import RegisterTemplate from 'src/mailer/register.template'
import { UsersStatus } from 'src/enum/users-status'
import { UsersRole } from 'src/enum/users-role'
import { TokenType } from 'src/enum/token-type'
import ForgotTemplate from 'src/mailer/forgot.template'
import { ResetPasswordRequest } from 'src/dto/request/reset-password.request'
import { UsersResponse } from 'src/dto/response/users.response'
import { UserDeailResponse } from 'src/dto/response/user-detail.response'
import validator from 'validator'
import { WeakPasswordException } from 'src/exception/weak-password.exception'
import { UserNotFoundException } from 'src/exception/user-not-found.exception'
import { TokenExpireException } from 'src/exception/token-expire.exception'
import { EmailExistingException } from 'src/exception/email-already.exception'
import { UserNotActiveException } from 'src/exception/user-not-active.exception'
import { UpdateProfileRequest } from 'src/dto/request/update-profile.request'
import { UpdateProfileResponse } from 'src/dto/response/update-profile.response'
import { ProfileResponse } from 'src/dto/response/profile.response'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private readonly mailerService: MailerService
  ) { }

  async createUser(createUserRequest: CreateUserRequest, lang: string): Promise<string> {
    const { firstName, lastName, email, tel, idNumber, idNumberType, img, description } = createUserRequest
    try {
      const passwordGenerated = this.generatePassword()
      const tmpUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        tel: tel,
        id_number: idNumber,
        id_number_type: idNumberType,
        img: img,
        status: UsersStatus.PRE_ACTIVE,
        role: UsersRole.MERCHANT,
        description: description,
        password: encryptedPassword(passwordGenerated),
      } as User

      const user = this.usersRepository.create(tmpUser)
      const saveUserData = await this.usersRepository.save(user)
      const respToken = await this.authService.generateTokenVerifyUser(saveUserData)
      await this.mailerService.sendMail({
        to: user.email,
        subject: lang == "th" ? "IN.9.CO – ยืนยันบัญชีผู้ใช้งาน" : "IN.9.CO – Verify Account",
        html: RegisterTemplate({ locale: lang, password: passwordGenerated, email: user.email, token: respToken })
      })
    } catch (error) {
      switch (error?.code) {
        case '23505': // unique statement
          throw new EmailExistingException()
        default:
          throw new InternalServerErrorException(
            error?.message || 'An unexpected error occurred',
          )
      }
    }
    return "Create user success"
  }

  async verifyUsers(token: string): Promise<string> {
    try {
      this.authService.verifyToken(token)
      const findToken = await this.tokenRepository.findOne({
        where: { token: token, type: TokenType.VERIFY_REGISTER },
        relations: ['user']
      })
      if (findToken) {
        if (findToken.expire_at.getTime() > new Date().getTime()) {
          const { user } = findToken
          user.status = UsersStatus.ACTIVE
          this.usersRepository.update(findToken.user.id, user)
          this.authService.deleteToken(user)
        } else {
          throw new TokenExpireException()
        }
      } else {
        throw new BadRequestException("Something went wrong.")
      }
      return "verify success"
    } catch (error) {
      throw error
    }
  }

  async getAllUsers(): Promise<UsersResponse[]> {
    try {
      const users = await this.usersRepository.find({ where: { role: Not(UsersRole.ADMIN) } })
      return users.map(user => user.toMapperUser())
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async getUser(id: number): Promise<UsersResponse | null> {
    try {
      const user = await this.usersRepository.findOneBy({ id })
      if (!user) {
        throw new UserNotFoundException()
      }
      return user.toMapperUserDetail()
    } catch (error) {
      throw error
    }
  }

  async getProfile(id: number): Promise<ProfileResponse> {
    try {
      const user = await this.usersRepository.findOneBy({ id })
      if (!user) {
        throw new UserNotFoundException()
      }
      return user.toMapperUserDetail()
    } catch (error) {
      throw error
    }
  }

  async updateProfile(id: number, updateProfileRequest: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const user = await this.usersRepository.findOneBy({ id })
      if (!user) {
        throw new UserNotFoundException()
      }
      if (user.status != UsersStatus.ACTIVE) {
        throw new UserNotActiveException()
      }
      user.first_name = updateProfileRequest.firstName
      user.last_name = updateProfileRequest.lastName
      user.tel = updateProfileRequest.tel
      user.img = updateProfileRequest.img
      user.id_number = updateProfileRequest.idNumber
      user.id_number_type = updateProfileRequest.idNumberType
      user.description = updateProfileRequest.description
      const updatedUser = await this.usersRepository.save(user)
      return updatedUser.toMapperProfile()
    } catch (error) {
      switch (error?.code) {
        case '23505': // unique statement
          throw new EmailExistingException()
        default:
          throw error
      }
    }
  }


  async updateUser(
    id: number,
    updateUserRequest: UpdateUserRequest,
  ): Promise<UserDeailResponse> {
    try {
      const user = await this.usersRepository.findOneBy({ id })

      if (!user) {
        throw new UserNotFoundException()
      }

      user.first_name = updateUserRequest.firstName
      user.last_name = updateUserRequest.lastName
      user.email = updateUserRequest.email
      user.tel = updateUserRequest.tel
      user.img = updateUserRequest.img
      user.id_number = updateUserRequest.idNumber
      user.id_number_type = updateUserRequest.idNumberType
      user.description = updateUserRequest.description

      const updatedUser = await this.usersRepository.save(user)
      return updatedUser.toMapperUserDetail()
    } catch (error) {
      switch (error?.code) {
        case '23505': // unique statement
          throw new EmailExistingException()
        default:
          throw error
      }
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.usersRepository.delete(id)
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async forgotPassword(email: string, lang: string): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({ where: { email }, relations: ['token'] })
      if (!user) {
        throw new UserNotFoundException()
      }
      if (user.status != UsersStatus.ACTIVE) {
        throw new UserNotActiveException()
      }
      if (user.token) {
        await this.authService.deleteToken(user)
      }

      const respToken = await this.authService.generateTokenResetPassword(user)
      await this.mailerService.sendMail({
        to: email,
        subject: lang == "th" ? "IN.9.CO – เปลี่ยนรหัสผ่าน" : "IN.9.CO – Reset password",
        html: ForgotTemplate({ locale: lang, email: email, token: respToken })
      })
      return "send email success"
    } catch (error) {
      throw error
    }
  }

  async resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<string> {
    const { token, newPassword } = resetPasswordRequest
    try {
      if (!this.isStrongPassword(newPassword)) {
        throw new WeakPasswordException()
      }
      this.authService.verifyToken(token)
      const findToken = await this.tokenRepository.findOne({
        where: { token: token, type: TokenType.RESET_PASSWORD },
        relations: ['user']
      })
      if (!findToken) {
        throw new TokenExpireException()
      }
      if (findToken.expire_at.getTime() > new Date().getTime()) {
        const { user } = findToken
        user.password = encryptedPassword(newPassword)
        this.usersRepository.update(findToken.user.id, user)
        this.authService.deleteToken(user)
      } else {
        throw new TokenExpireException()
      }
    } catch (error) {
      throw error
    }
    return "Success"
  }

  private generatePassword(): string {
    const length = 10
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
    let passwordValue = ''
    for (let i = 0; i < length; i++) {
      const at = Math.floor(Math.random() * charset.length)
      passwordValue += charset.charAt(at)
    }
    return passwordValue
  }

  private isStrongPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    )
  }

}
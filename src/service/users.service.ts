import { BadRequestException, Logger, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Req, Res, UnauthorizedException, HttpException } from '@nestjs/common'
import { Response, Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Users } from '../entity/users'
import { CreateUserRequest } from '../dto/models/request/create.user.request'
import encryptedPassword from '../utils/encrypted.password'
import { UpdateUserRequest } from 'src/dto/models/request/update.user.request'
import { Token } from 'src/entity/token'
import { AuthService } from './auth.service'
import { ForgotPasswordRequest } from 'src/dto/models/request/forgot.password.request'
import { MailerService } from '@nestjs-modules/mailer'
import RegisterTemplate from 'src/mailer/register.template'
import { UsersStatus } from 'src/enum/users-status'
import { UsersRole } from 'src/enum/users-role'
import { TokenType } from 'src/enum/token.type'
import ForgotTemplate from 'src/mailer/forgot.template'
import { ResetPasswordRequest } from 'src/dto/models/request/reset.password.request'
import * as bcrypt from 'bcrypt'
import { UsersResponse } from 'src/dto/response/users-response'


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private readonly mailerService: MailerService
  ) { }

  async createUser(createUserRequest: CreateUserRequest, lang: string): Promise<string> {
    const { firstName, lastName, email, tel, idNumber, idNumberType, img, description } = createUserRequest
    try {
      var responseFindUser = await this.usersRepository.findOne({
        where: { email }
      })
      if (!responseFindUser) {
        const passwordGenerated = this.generatePassword()
        const userAccount = {
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
          created_at: new Date(),
          updated_at: new Date(),
        }
        try {
          const saveUserData = await this.usersRepository.save(userAccount)
          const respToken = await this.authService.generateTokenVerifyUser(saveUserData)
          await this.mailerService.sendMail({
            to: userAccount.email,
            subject: lang == "th" ? "IN.9.CO – ยืนยันบัญชีผู้ใช้งาน" : "IN.9.CO – Verify Account",
            html: RegisterTemplate({ locale: lang, password: passwordGenerated, email: userAccount.email, token: respToken })
          })
        } catch (error) {
          throw new InternalServerErrorException("Some thing went wrong!")
        }
      } else {
        throw new BadRequestException(`The user ${email} exists`)
      }
      return "Success"
    } catch (error) {
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
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
          throw new BadRequestException("Token expire.")
        }
      } else {
        throw new BadRequestException("Something went wrong.")
      }
      return "verify success"
    } catch (error) {
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getAllUsers(): Promise<UsersResponse[]> {
    try {
      const users = await this.usersRepository.find({ where: { role: Not(UsersRole.ADMIN) } })
      return users.map(user => user.toMapperUser())
    } catch (error) {
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getUser(id: number): Promise<UsersResponse | null> {
    try {
      const user = await this.usersRepository.findOneBy({ id })

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

      return user.toMapperUserDetail()
    } catch (error) {
      const errorMessage = error.message || 'Internal Server Error'
      const errorStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR
      throw new HttpException(errorMessage, errorStatus)
    }
  }


  async updateUser(
    id: number,
    updateUserRequest: UpdateUserRequest,
  ): Promise<Users | null> {
    try {
      const existingUser = await this.usersRepository.findOneBy({ id })

      if (!existingUser) {
        throw new Error('User account not found')
      }

      updateUserRequest.firstName ? existingUser.first_name = updateUserRequest.firstName : existingUser.first_name
      updateUserRequest.lastName ? existingUser.last_name = updateUserRequest.lastName : existingUser.last_name
      updateUserRequest.email ? existingUser.email = updateUserRequest.email : existingUser.email
      updateUserRequest.password ? existingUser.password = updateUserRequest.password : existingUser.password
      updateUserRequest.tel ? existingUser.tel = updateUserRequest.tel : existingUser.tel
      updateUserRequest.img ? existingUser.img = updateUserRequest.img : existingUser.img
      updateUserRequest.status ? existingUser.status = updateUserRequest.status : existingUser.status
      updateUserRequest.role ? existingUser.role = updateUserRequest.role : existingUser.role
      existingUser.updated_at = new Date()

      const updatedUser = await this.usersRepository.save(existingUser)
      return updatedUser
    } catch (error) {
      throw error
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const userAccount = await this.usersRepository.findOne({ where: { id } })

      if (!userAccount) {
        throw new Error('User account not found')
      }

      await this.authService.deleteToken(userAccount)
      await this.usersRepository.delete(id.toString())
    } catch (error) {
      throw error
    }
  }

  async forgotPassword(email: string, lang: string): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({ where: { email }, relations: ['token'] })
      if (!user) {
        throw new NotFoundException("Not found account")
      }
      if (user.status != UsersStatus.ACTIVE) {
        throw new UnauthorizedException("User are not active")
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
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<string> {
    const { token, newPassword } = resetPasswordRequest
    try {
      this.authService.verifyToken(token)
      const findToken = await this.tokenRepository.findOne({
        where: { token: token, type: TokenType.RESET_PASSWORD },
        relations: ['user']
      })
      if (!findToken) {
        throw new BadRequestException("Not found token")
      }
      if (findToken.expire_at.getTime() > new Date().getTime()) {
        const { user } = findToken
        user.password = encryptedPassword(newPassword)
        this.usersRepository.update(findToken.user.id, user)
        this.authService.deleteToken(user)
      } else {
        throw new BadRequestException("Token expire.")
      }
    } catch (error) {
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    return "Success"
  }

  generatePassword(): string {
    const length = 10
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
    let passwordValue = ''
    for (let i = 0; i < length; i++) {
      const at = Math.floor(Math.random() * charset.length)
      passwordValue += charset.charAt(at)
    }
    return passwordValue
  }

}
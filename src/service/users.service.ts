import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Res } from '@nestjs/common'
import { Response } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Users } from '../entity/users'
import { CreateUserRequest } from '../dto/models/request/create.user.request'
import encryptedPassword from '../utils/encrypted.password'
import { UpdateUserRequest } from 'src/dto/models/request/update.user.request'
import { Token } from 'src/entity/token'
import { AuthService } from './auth.service'
import { ForgotPasswordRequest } from 'src/dto/models/request/forgot.password.user.request'
import { MailerService } from '@nestjs-modules/mailer'
import { SendEmailVerifyRequest } from 'src/dto/models/request/send.email.verify.request'
import { SendEmailForgotPasswordRequest } from 'src/dto/models/request/send.email.forgot.password'
import RegisterTemplate from 'src/mailer/register.template'
import { UsersStatus } from 'src/enum/users-status'
import { UsersRole } from 'src/enum/users-role'
import { TokenType } from 'src/enum/token.type'

const utcOffset = 7 * 60 * 60 * 1000

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private readonly mailerService: MailerService
  ) { }

  async createUser(createUsersRequest: CreateUserRequest, @Res() res: Response): Promise<string> {
    const { firstName, lastName, email, tel, idNumber, idNumberType, img, description } = createUsersRequest
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
        const respToken = await this.authService.generateToken(saveUserData)
        var sendEmailVerifyRequest: SendEmailVerifyRequest = {
          userAccount: saveUserData,
          token: respToken,
          password: passwordGenerated,
          language: "th"
        }
        await this.sendEmailVerify(sendEmailVerifyRequest)
      } catch (error) {
        throw error
      }
    } else {
      throw new BadRequestException(`The user ${email} exists`)
    }
    return "Success"
  }

  async verifyUsers(token: string): Promise<string> {
    const findToken = await this.tokenRepository.findOne({
      where: { token: token, type: TokenType.VERIFY_REGISTER },
      relations: ['user']
    })
    if (findToken) {
      if (findToken.expire_at.getTime() > new Date().getTime()) {
        const { id: tokenId, user } = findToken
        user.status = UsersStatus.ACTIVE
        this.usersRepository.update(findToken.user.id, user)
        this.tokenRepository.delete(tokenId)
      } else {
        throw new BadRequestException("Token expire.")
      }
    } else {
      throw new BadRequestException("Something went wrong.")
    }
    return "verify success"
  }

  async getAllUsers(): Promise<Users[]> {
    try {
      return await this.usersRepository.find()
    } catch (error) {
      throw error
    }
  }

  async getUser(id: number): Promise<Users | null> {
    try {
      return await this.usersRepository.findOneBy({ id })
    } catch (error) {
      throw error
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

      await this.tokenRepository.delete({ user: userAccount })
      await this.usersRepository.delete(id.toString())
    } catch (error) {
      throw error
    }
  }

  async forgotPassword(forgotPasswordRequest: ForgotPasswordRequest, @Res() res: Response): Promise<Users> {
    try {
      const userAccount = await this.usersRepository.findOne({ where: { id: forgotPasswordRequest.userId } })

      if (!userAccount) {
        throw new Error('User account not found')
      }

      if (userAccount.password !== forgotPasswordRequest.oldPassword) {
        throw new Error('Password is incorrect')
      }

      if (forgotPasswordRequest.newPassword !== forgotPasswordRequest.verifyPassword) {
        throw new Error('New password and verify password not match')
      }

      userAccount.password = forgotPasswordRequest.newPassword
      userAccount.updated_at = new Date()

      let updatedUser = await this.usersRepository.save(userAccount)

      if (updatedUser !== null) {
        await this.authService.generateToken(updatedUser)
        userAccount.password = forgotPasswordRequest.newPassword
        var sendForgotPasswordRequest = new SendEmailForgotPasswordRequest()
        sendForgotPasswordRequest.userAccount = userAccount
        await this.sendEmailForgotPassword(sendForgotPasswordRequest, res)

        return await this.usersRepository.save(userAccount)
      }
    } catch (error) {
      throw error
    }
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

  //TODO:languages for send email header
  async sendEmailVerify(sendEmailVerifyRequest: SendEmailVerifyRequest): Promise<string> {
    try {
      const { token, userAccount, password, language } = sendEmailVerifyRequest

      await this.mailerService.sendMail({
        to: userAccount.email,
        subject: language == "th" ? "IN.9.CO – ยืนยันบัญชีผู้ใช้งาน" : "IN.9.CO – Verify Account",
        html: RegisterTemplate({ locale: language, password: password, email: userAccount.email, token: token })
      })
      return "Success"
    } catch (error) {
      console.log(error.message)
      return "Error"
    }
  }

  async sendEmailForgotPassword(sendForgotEmailRequest: SendEmailForgotPasswordRequest, @Res() res: Response): Promise<any> {
    try {
      //     let tokenValue = await this.tokenRepository.findOne({ where: { user: sendForgotEmailRequest.userAccount } })
      //     let linkForgotPassword = `http://localhost:3000/forgotPassword?${sendForgotEmailRequest.userAccount.token}`
      //     let email = sendForgotEmailRequest.userAccount.email
      //     let password = sendForgotEmailRequest.userAccount.password

      //     if (tokenValue !== null) {
      //       throw new Error('Token already exists')
      //     }

      //     let sendEmailVerify = new SendEmailVerifyRequest()
      //     sendEmailVerify.fromAuthor = "in9co@mail.com"

      //     await this.authService.verifyToken(tokenValue.token)

      //     await this.mailerService.sendMail({
      //       to: sendForgotEmailRequest.userAccount.email,
      //       from: sendForgotEmailRequest.fromAuthor,
      //       subject: sendForgotEmailRequest.language == "th" ? "IN.9.CO – รีเซ็ตรหัสผ่านผู้ใช้งาน" : "IN.9.CO – Reset Password",
      //       html: sendForgotEmailRequest.language == "th"
      //         ? `<p font-size: 16p>สวัสดี ${sendForgotEmailRequest.userAccount.first_name}, ${sendForgotEmailRequest.userAccount.last_name}<\p>
      //               <br>
      //               <h1 font-size: 16px>กรุณาคลิกที่นี่เพื่อรีเซ็ตรหัสผ่านของคุณ</h1>
      //               <br>
      //               <br>
      //               <p font-size: 16px>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง<\p>
      //               <br>
      //               <p font-size: 16px>หากคุณไม่ได้ดำเนินการรีเซ็ตรหัสผ่านด้วยตนเองหรือไม่ต้องการ<\p>
      //               <br>
      //               <p font-size: 16px>เปลี่ยนรหัสผ่าน โปรดละเว้นอีเมลนี้<\p>
      //               <br>
      //               <br>
      //                 <a href="${linkForgotPassword}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
      //                   คลิกที่นี่
      //                 </a>
      //                 <br>
      //                 <br>
      //                 <p font-size: 16px>ขอแสดงความนับถือ</p>
      //                 <br>
      //                 <p font-size: 16px>ทีมงาน IN.9.CO</p>`
      //         : `<h1 font-size: 16px>Verify Emai</h1>
      //                 <br>
      //                 <p font-size: 16px>Hello ${sendForgotEmailRequest.userAccount.first_name}, ${sendForgotEmailRequest.userAccount.last_name}<\p>
      //                 <br>
      //                 <h1 font-size: 16px>Please click here to reset your password<\h1>
      //                 <br>
      //                 <br>
      //                 <a href="${linkForgotPassword}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
      //                   Click here
      //                 </a>
      //                 <br>
      //                 <br>
      //                 <p font-size: 16px>This link will expire in 1 hours.<\p>
      //                 <br>
      //                 <p font-size: 16px>If you have not triggered this password reset yourself or if you <\p>
      //                 <br>
      //                 <p font-size: 16px>do not wish to change your password, please ignore this mail.<\p>
      //                 <br>
      //                 <br>
      //                 <p font-size: 16px>Kind regards,</p>
      //                 <br>
      //                 <p font-size: 16px>Team IN.9.CO</p>`,
      //     })
      //     return res.status(HttpStatus.OK).json({ message: "Send success" })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Can't send" })
    }
  }
}
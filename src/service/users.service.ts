import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersAccount } from '../entity/users.account';
import { CreateUserRequest } from '../dto/request/create.user.request';
import encryptedPassword from '../utils/encrypted.password';
import { UpdateUserRequest } from 'src/dto/request/update.user.request';
import { Token } from 'src/entity/token';
import { AuthService } from './auth.service';
import { ForgotPasswordRequest } from 'src/dto/request/forgot.password.user.request';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailVerifyRequest } from 'src/dto/request/send.email.verify.request';
import { SendEmailForgotPasswordRequest } from 'src/dto/request/send.email.forgot.password';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UsersAccount)
    private usersAccountRepository: Repository<UsersAccount>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private readonly mailerService: MailerService
  ) {}

  async createUser(createUsersRequest: CreateUserRequest, @Res() res: Response): Promise<UsersAccount> {
    let userData = new UsersAccount();
    let passwordGenerated = this.generatePassword();

    const existingUser = await this.usersAccountRepository.findOne({
      where: [
        { email: createUsersRequest.email }
      ]
    });

    if (existingUser) {
      throw new Error('Email duplicate');
    }

    userData.first_name = createUsersRequest.firstName;
    userData.last_name = createUsersRequest.lastName;
    userData.email = createUsersRequest.email;
    userData.tel = createUsersRequest.tel;
    userData.id_number = createUsersRequest.idNumber;
    userData.id_number_type = createUsersRequest.idNumberType;
    userData.img = createUsersRequest.img;
    userData.status = createUsersRequest.status;
    userData.role = createUsersRequest.role;
    userData.description = createUsersRequest.description;
    userData.password = encryptedPassword(passwordGenerated);
    userData.created_at = new Date();
    userData.updated_at = new Date();

    try {
      let saveUserData = await this.usersAccountRepository.save(userData);

      if (saveUserData !== null) {
        await this.authService.generateToken(userData.id);
        userData.password = passwordGenerated;
        var sendEmailVerifyRequest = new SendEmailVerifyRequest();
        sendEmailVerifyRequest.userAccount = userData;
        await this.sendEmailVerify(sendEmailVerifyRequest, res);
        return userData;
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<UsersAccount[]> {
    try {
      return await this.usersAccountRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getUser(id: bigint): Promise<UsersAccount | null>{
    try {
      return await this.usersAccountRepository.findOneBy({id});
    } catch (error) {
      throw error;
    }
  }

  async updateUser(
    id: bigint,
    updateUserRequest: UpdateUserRequest,
  ): Promise<UsersAccount | null> {
    try {
      const existingUser = await this.usersAccountRepository.findOneBy({ id });

      if (!existingUser) {
        throw new Error('User account not found');
      }

      updateUserRequest.firstName ? existingUser.first_name = updateUserRequest.firstName : existingUser.first_name;
      updateUserRequest.lastName ? existingUser.last_name = updateUserRequest.lastName : existingUser.last_name;
      updateUserRequest.email ? existingUser.email = updateUserRequest.email : existingUser.email;
      updateUserRequest.password ? existingUser.password = updateUserRequest.password : existingUser.password;
      updateUserRequest.tel ? existingUser.tel = updateUserRequest.tel : existingUser.tel;
      updateUserRequest.img ? existingUser.img = updateUserRequest.img : existingUser.img;
      updateUserRequest.status ? existingUser.status = updateUserRequest.status : existingUser.status;
      updateUserRequest.role ? existingUser.role = updateUserRequest.role : existingUser.role;
      existingUser.updated_at = new Date();

      const updatedUser = await this.usersAccountRepository.save(existingUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: bigint): Promise<void> {
    try {
      const userAccount = await this.usersAccountRepository.findOne({ where: { id } });

      if (!userAccount) {
        throw new Error('User account not found');
      }

      await this.tokenRepository.delete({ users_id: userAccount });
      await this.usersAccountRepository.delete(id.toString());
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(forgotPasswordRequest: ForgotPasswordRequest, @Res() res: Response): Promise<UsersAccount> {
    try {
      const userAccount = await this.usersAccountRepository.findOne({ where: { id: forgotPasswordRequest.userId } });

      if (!userAccount) {
        throw new Error('User account not found');
      }

      if (userAccount.password !== forgotPasswordRequest.oldPassword) {
        throw new Error('Password is incorrect');
      }

      if (forgotPasswordRequest.newPassword !== forgotPasswordRequest.verifyPassword) {
        throw new Error('New password and verify password not match');
      }

      userAccount.password = forgotPasswordRequest.newPassword;
      userAccount.updated_at = new Date();

      let updatedUser = await this.usersAccountRepository.save(userAccount);

      if (updatedUser !== null) {
        await this.authService.generateToken(forgotPasswordRequest.userId);
        userAccount.password = forgotPasswordRequest.newPassword;
        var sendForgotPasswordRequest = new SendEmailForgotPasswordRequest();
        sendForgotPasswordRequest.userAccount = userAccount;
        await this.sendEmailForgotPassword(sendForgotPasswordRequest, res);

        return await this.usersAccountRepository.save(userAccount);
      }
    } catch (error) {
      throw error;
    }
  }

  generatePassword(): string {
    const length = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let passwordValue = '';
    for (let i = 0; i < length; i++) {
      const at = Math.floor(Math.random() * charset.length);
      passwordValue += charset.charAt(at);
    }
    return passwordValue;
  }

  async sendEmailVerify(sendEmailVerifyRequest: SendEmailVerifyRequest, @Res() res: Response): Promise<any> {
    try {
      let tokenValue = await this.tokenRepository.findOne({ where: { users_id: sendEmailVerifyRequest.userAccount} });
      let linkVerify = `http://localhost:3000/verifyRegister?${tokenValue.token}`;
      let email = sendEmailVerifyRequest.userAccount.email;
      let password = sendEmailVerifyRequest.userAccount.password;

      if (tokenValue !== null) {
        throw new Error('Token already exists');
      }

      let sendEmailVerify = new SendEmailVerifyRequest();
      sendEmailVerify.fromAuthor = "in9co@mail.com";

        await this.authService.verifyToken(tokenValue.token);

        await this.mailerService.sendMail({
          to: sendEmailVerifyRequest.userAccount.email,
          from: sendEmailVerify.fromAuthor,
          subject: sendEmailVerifyRequest.language == "th" ? "IN.9.CO – ยืนยันบัญชีผู้ใช้งาน" : "IN.9.CO – Verify Account",
          html: sendEmailVerifyRequest.language == "th" 
                ? `<h1 font-size: 16px>ยืนยันอีเมล</h1>
                <br>
                <p font-size: 16px>ท่านได้สร้างบัญชีการใช้งานโดยใช้อีเมลดังต่อไปนี้: ${email}<\p>
                <br>
                <p font-size: 16px>คลิกปุ่ม "เข้าสู่ระบบ" ด้านล่างเพื่อยืนยันอีเมลและเข้าบัญชีการใช้งานของท่าน<\p>
                <br>
                <br>
                <h1 font-size: 16px>ขั้นตอนการเข้าสู่ระบบการใช้งาน</h1>
                  <br>
                  <p font-size: 16px>อีเมล: ${email}</p>
                  <br>
                  <p font-size: 16px>รหัสผ่าน: ${password}</p>
                   <br>
                   <br>
                  <a href="${linkVerify}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
                    เข้าสู่ระบบ in9.co
                  </a>
                  <br>
                  <br>
                  <p font-size: 16px>ขอแสดงความนับถือ</p>
                  <br>
                  <p font-size: 16px>ทีมงาน IN.9.CO</p>`
                : `<h1 font-size: 16px>Verify Emai</h1>
                  <br>
                  <p font-size: 16px>You have created an account using the following email: ${email}<\p>
                  <br>
                  <p font-size: 16px>Click the "Sign In" button below to confirm your email and log into your account.<\p>
                  <br>
                  <br>
                  <h1 font-size: 16px>Please login</h1>
                  <br>
                  <p font-size: 16px>Email: ${email}</p>
                  <br>
                  <p font-size: 16px>Password: ${password}</p>
                  <a href="${linkVerify}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
                    Login in9.co
                  </a>
                  <br>
                  <br>
                  <p font-size: 16px>Kind regards,</p>
                  <br>
                  <p font-size: 16px>Team IN.9.CO</p>`,
        });
        return res.status(HttpStatus.OK).json({ message: "Send success" });
    } catch (error) {
      console.log(error.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Can't send" });
    }
  }

  async sendEmailForgotPassword(sendForgotEmailRequest: SendEmailForgotPasswordRequest, @Res() res: Response): Promise<any> {
    try {
      let tokenValue = await this.tokenRepository.findOne({ where: { users_id: sendForgotEmailRequest.userAccount} });
      let linkForgotPassword = `http://localhost:3000/forgotPassword?${tokenValue.token}`;
      let email = sendForgotEmailRequest.userAccount.email;
      let password = sendForgotEmailRequest.userAccount.password;

      if (tokenValue !== null) {
        throw new Error('Token already exists');
      }

      let sendEmailVerify = new SendEmailVerifyRequest();
      sendEmailVerify.fromAuthor = "in9co@mail.com";

        await this.authService.verifyToken(tokenValue.token);

        await this.mailerService.sendMail({
          to: sendForgotEmailRequest.userAccount.email,
          from: sendForgotEmailRequest.fromAuthor,
          subject: sendForgotEmailRequest.language == "th" ? "IN.9.CO – รีเซ็ตรหัสผ่านผู้ใช้งาน" : "IN.9.CO – Reset Password",
          html: sendForgotEmailRequest.language == "th" 
                ? `<p font-size: 16p>สวัสดี ${sendForgotEmailRequest.userAccount.first_name}, ${sendForgotEmailRequest.userAccount.last_name}<\p>
                <br>
                <h1 font-size: 16px>กรุณาคลิกที่นี่เพื่อรีเซ็ตรหัสผ่านของคุณ</h1>
                <br>
                <br>
                <p font-size: 16px>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง<\p>
                <br>
                <p font-size: 16px>หากคุณไม่ได้ดำเนินการรีเซ็ตรหัสผ่านด้วยตนเองหรือไม่ต้องการ<\p>
                <br>
                <p font-size: 16px>เปลี่ยนรหัสผ่าน โปรดละเว้นอีเมลนี้<\p>
                <br>
                <br>
                  <a href="${linkForgotPassword}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
                    คลิกที่นี่
                  </a>
                  <br>
                  <br>
                  <p font-size: 16px>ขอแสดงความนับถือ</p>
                  <br>
                  <p font-size: 16px>ทีมงาน IN.9.CO</p>`
                : `<h1 font-size: 16px>Verify Emai</h1>
                  <br>
                  <p font-size: 16px>Hello ${sendForgotEmailRequest.userAccount.first_name}, ${sendForgotEmailRequest.userAccount.last_name}<\p>
                  <br>
                  <h1 font-size: 16px>Please click here to reset your password<\h1>
                  <br>
                  <br>
                  <a href="${linkForgotPassword}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
                    Click here
                  </a>
                  <br>
                  <br>
                  <p font-size: 16px>This link will expire in 1 hours.<\p>
                  <br>
                  <p font-size: 16px>If you have not triggered this password reset yourself or if you <\p>
                  <br>
                  <p font-size: 16px>do not wish to change your password, please ignore this mail.<\p>
                  <br>
                  <br>
                  <p font-size: 16px>Kind regards,</p>
                  <br>
                  <p font-size: 16px>Team IN.9.CO</p>`,
        });
        return res.status(HttpStatus.OK).json({ message: "Send success" });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Can't send" });
    }
  }
}
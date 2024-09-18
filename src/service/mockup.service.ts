import { HttpStatus, Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { mailDto } from 'src/dto/email/mailDto'
import { Response } from 'express'
import { Res } from '@nestjs/common'

@Injectable()
export class MockUpService {
  constructor(
    private readonly mailerService: MailerService
  ) { }

  async postMail(
    mailDto: mailDto, @Res() res: Response
  ) {
    let { to, from, subject, text } = mailDto

    try {
      await this.mailerService.sendMail({
        to: to,
        from: from,
        subject: subject,
        text: text
      })
      return res.status(HttpStatus.OK).json({ message: "Send success" })
    } catch (error) {
      console.log(error.message)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Can't send" })
    }
  }
}
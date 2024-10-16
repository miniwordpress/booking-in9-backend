import * as dotenv from 'dotenv'
import { ForgotPasswordMailer } from "src/dto/email/forgotPasswordDto"
dotenv.config()

export default function ForgotTemplate(content: ForgotPasswordMailer) {
  const { locale, token } = content
  const endpoint = `${process.env.ENDPOINT_FRONTEND}/reset-password?token=${token}`
  if (locale == "th") {
    return `<h1 font-size: 16px>ลืมรหัสผ่าน</h1>
                    <br>
                    <a href="${endpoint}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
                      เปลี่ยนรหัสผ่าน
                    </a>
                    <br>
                    <br>
                    <p font-size: 16px>ขอแสดงความนับถือ</p>
                    <br>
                    <p font-size: 16px>ทีมงาน IN.9.CO</p>`
  } else {
    `<h1 font-size: 16px>Forgot password</h1>
                    <br>
                    <a href="${endpoint}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
                      Change password
                    </a>
                    <br>
                    <br>
                    <p font-size: 16px>Kind regards,</p>
                    <br>
                    <p font-size: 16px>Team IN.9.CO</p>`
  }
}
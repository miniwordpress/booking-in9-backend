import { RegisterMailer } from "src/dto/email/registerDto"

export default function RegisterTemplate(content: RegisterMailer) {
  const { locale, password, email, token } = content
  const endpoint = `http://localhost:4000/verifyRegister?${token}`
  if (locale == "th") {
    return `<h1 font-size: 16px>ยืนยันอีเมล</h1>
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
                    <a href="${endpoint}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
                      เข้าสู่ระบบ in9.co
                    </a>
                    <br>
                    <br>
                    <p font-size: 16px>ขอแสดงความนับถือ</p>
                    <br>
                    <p font-size: 16px>ทีมงาน IN.9.CO</p>`
  } else {
    `<h1 font-size: 16px>Verify Emai</h1>
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
                    <a href="${endpoint}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #13D440; text-decoration: none; border-radius: 5px;">
                      Login in9.co
                    </a>
                    <br>
                    <br>
                    <p font-size: 16px>Kind regards,</p>
                    <br>
                    <p font-size: 16px>Team IN.9.CO</p>`
  }


}
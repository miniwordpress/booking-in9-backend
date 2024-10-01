import { UserAccountModel } from "src/dto/models/user.model"

export class RegisterResponse {
  code: string
  data?: any
  message: string
  cause?: string
}
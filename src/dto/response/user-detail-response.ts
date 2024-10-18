import { UsersStatus } from "src/enum/users-status"

export class UserDeailResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  tel: string
  idNumber: string
  idNumberType: string
  img: string
  status: UsersStatus
  description: string
}
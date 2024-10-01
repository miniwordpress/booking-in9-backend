import { UsersRole } from "src/enum/users-role"
import { UsersStatus } from "src/enum/users-status"
import { Users } from "src/entity/users"

export class SignInResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  tel: string
  idNumber: string
  img: string
  status: UsersStatus
  role: UsersRole
  description: string
  accessToken: string

  constructor(user: Users,accessToken: string) {
    this.id = user.id
    this.firstName = user.first_name
    this.lastName = user.last_name
    this.email = user.email
    this.tel = user.tel
    this.idNumber = user.id_number
    this.img = user.img
    this.status = user.status
    this.role = user.role
    this.description = user.description
    this.accessToken = accessToken
  }
}
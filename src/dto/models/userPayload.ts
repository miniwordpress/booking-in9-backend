import { UsersRole } from "src/enum/users-role"

export class Userpayload {
  id: number
  email: string
  role: UsersRole
}
import { UsersStatus } from "src/enum/users-status"

export class UsersResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  status: UsersStatus
}
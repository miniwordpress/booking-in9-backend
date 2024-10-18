import { TokenType } from "src/enum/token.type"
import { UsersRole } from "src/enum/users-role"

export class UserContext {
  id: number
  email: string
  role: UsersRole
  tokenType: TokenType
}
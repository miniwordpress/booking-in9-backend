import { TokenType } from "src/enum/token-type"
import { UsersRole } from "src/enum/users-role"

export class TokenPayload {
  id: number
  tokenType: TokenType
}
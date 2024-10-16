import { IsJWT, IsNotEmpty } from "class-validator"
import { Match } from "src/utils/match.decorator"

export class ResetPasswordRequest {
  @IsNotEmpty()
  newPassword: string
  @Match('newPassword')
  @IsNotEmpty()
  confirmPassword: string
  @IsNotEmpty()
  oldPassword: string
  @IsNotEmpty()
  @IsJWT()
  token: string
}
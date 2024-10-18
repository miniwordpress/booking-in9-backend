import { IsJWT, IsNotEmpty } from 'class-validator'

export class VerifyUserRequest {
  @IsNotEmpty()
  @IsJWT()
  token: string
}
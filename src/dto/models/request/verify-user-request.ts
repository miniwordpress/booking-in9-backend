import { IsNotEmpty } from 'class-validator'

export class VerifyUserRequest {
  @IsNotEmpty()
  token: string
}

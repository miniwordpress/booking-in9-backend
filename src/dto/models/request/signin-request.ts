import { IsNotEmpty } from 'class-validator'

export class SignInRequest {

  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}

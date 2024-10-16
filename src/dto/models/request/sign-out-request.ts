import { IsJWT, IsNotEmpty } from 'class-validator'

export class SignOutRequest {

  @IsNotEmpty()
  @IsJWT()
  token: string

}

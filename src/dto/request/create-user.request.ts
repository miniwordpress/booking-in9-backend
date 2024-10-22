import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { IDNumberType } from 'src/enum/id-number-type'

export class CreateUserRequest {
  id: bigint

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(30)
  tel: string

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  idNumber: string

  @IsNotEmpty()
  @IsEnum(IDNumberType)
  idNumberType: IDNumberType

  img?: string

  description?: string
}

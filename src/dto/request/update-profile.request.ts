import { IsEnum, IsNotEmpty, MaxLength, MinLength } from "class-validator"
import { IDNumberType } from "src/enum/id.number.type"

export class UpdateProfileRequest {

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(30)
  tel: string

  img?: string

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  idNumber: string

  @IsNotEmpty()
  @IsEnum(IDNumberType)
  idNumberType: IDNumberType

  description?: string
}
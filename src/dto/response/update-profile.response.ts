import { IDNumberType } from "src/enum/id-number-type"

export class UpdateProfileResponse {
  firstName: string
  lastName: string
  tel: string
  img?: string
  idNumber: string
  idNumberType: IDNumberType
  description?: string
}
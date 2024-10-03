import * as dotenv from 'dotenv'
dotenv.config()

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'a138f47678d581be2217ffc70ff37df740faf633610ac9e0a01578964b088d6d'
}
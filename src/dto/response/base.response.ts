export interface BaseResponse<T = any> {
  code?: string | "0000"
  data: T | null
  cause?: any | null
  message: string
}
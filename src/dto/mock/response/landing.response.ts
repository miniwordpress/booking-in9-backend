export class LandingResponse {
  hostel: hostelDetail[]
}

export class hostelDetail {
  id: number
  img: string
  name: string
  country: string
  pricing: string
  address: string
}
import { HttpStatus, Injectable, Res } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { mailDto } from '../dto/email/mailDto'
import { Response } from 'express'
import { LandingResponse } from 'src/dto/mock/response/landing.response'

@Injectable()
export class MockUpService {
  constructor(
    private readonly mailerService: MailerService
  ) { }


  private hostels = [
    {
      id: 1,
      img: "https://picsum.photos/300/300",
      name: "Sunset Ridge Inn",
      country: "United States",
      pricing: "2,500 - 5,000 TH",
      address: "123 Sunset Blvd, Los Angeles, CA 90001"
    },
    {
      id: 2,
      img: "https://picsum.photos/300/300",
      name: "Pine Valley Lodge",
      country: "United States",
      pricing: "1,000 - 2,500 TH",
      address: "456 Pine Rd, Asheville, NC 28801"
    },
    {
      id: 3,
      img: "https://picsum.photos/300/300",
      name: "Coastal Breeze Resort",
      country: "United States",
      pricing: "500 - 1,000 TH",
      address: "789 Ocean Dr, Miami, FL 33139"
    },
    {
      id: 4,
      img: "https://picsum.photos/300/300",
      name: "Maplewood Suites",
      country: "United States",
      pricing: "500 - 1,000 TH",
      address: "321 Maple St, Denver, CO 80202"
    },
    {
      id: 5,
      img: "https://picsum.photos/300/300",
      name: "Skyline Heights Hotel",
      country: "United States",
      pricing: "7,500 - 10,000 TH",
      address: "654 Skyline Dr, Seattle, WA 98101"
    },
    {
      id: 6,
      img: "https://picsum.photos/300/300",
      name: "Golden Sands Retreat",
      country: "United States",
      pricing: "1,000 - 2,500 TH",
      address: "987 Golden Sands Ln, San Diego, CA 92101"
    },
    {
      id: 7,
      img: "https://picsum.photos/300/300",
      name: "Lakeside Haven",
      country: "United States",
      pricing: "500 - 1,000 TH",
      address: "135 Lakeside Dr, Chicago, IL 60601"
    },
    {
      id: 8,
      img: "https://picsum.photos/300/300",
      name: "Mountain View Lodge",
      country: "United States",
      pricing: "7,500 - 10,000 TH",
      address: "246 Mountain View Rd, Boulder, CO 80301"
    },
    {
      id: 9,
      img: "https://picsum.photos/300/300",
      name: "Crystal Lake Hotel",
      country: "United States",
      pricing: "1,000 - 2,500 TH",
      address: "357 Crystal Lake Rd, Orlando, FL 32801"
    },
    {
      id: 10,
      img: "https://picsum.photos/300/300",
      name: "Urban Oasis Boutique Hotel",
      country: "United States",
      pricing: "1,000 - 2,500 TH",
      address: "468 Urban St, New York, NY 10001"
    },
    {
      id: 11,
      img: "https://picsum.photos/300/300",
      name: "Windsor Park Inn",
      country: "United States",
      pricing: "500 - 1,000 TH",
      address: "579 Windsor Way, San Francisco, CA 94101"
    },
    {
      id: 12,
      img: "https://picsum.photos/300/300",
      name: "Heritage Valley Resort",
      country: "United States",
      pricing: "2,500 - 5,000 TH",
      address: "680 Heritage Dr, Phoenix, AZ 85001"
    },
    {
      id: 13,
      img: "https://picsum.photos/300/300",
      name: "Lotus Blossom Resort",
      country: "Thailand",
      pricing: "7,500 - 10,000 TH",
      address: "123 Lotus Blossom Rd, Chiang Mai, Thailand 50000"
    },
    {
      id: 14,
      img: "https://picsum.photos/300/300",
      name: "Emerald Bay Hotel",
      country: "Thailand",
      pricing: "1,000 - 2,500 TH",
      address: "456 Emerald Bay St, Phuket, Thailand 83000"
    },
    {
      id: 15,
      img: "https://picsum.photos/300/300",
      name: "Bamboo Grove Inn",
      country: "Thailand",
      pricing: "7,500 - 10,000 TH",
      address: "789 Bamboo Grove Ln, Koh Samui, Thailand 84320"
    },
    {
      id: 16,
      img: "https://picsum.photos/300/300",
      name: "Sapphire Shores Resort",
      country: "Thailand",
      pricing: "2,500 - 5,000 TH",
      address: "321 Sapphire Shores Rd, Pattaya, Thailand 20150"
    },
    {
      id: 17,
      img: "https://picsum.photos/300/300",
      name: "Tropical Paradise Suites",
      country: "Thailand",
      pricing: "7,500 - 10,000 TH",
      address: "654 Tropical Paradise St, Krabi, Thailand 81180"
    },
    {
      id: 18,
      img: "https://picsum.photos/300/300",
      name: "Serene Waters Boutique Hotel",
      country: "Thailand",
      pricing: "5,000 - 7,500 TH",
      address: "987 Serene Waters Rd, Hua Hin, Thailand 77110"
    },
    {
      id: 19,
      img: "https://picsum.photos/300/300",
      name: "Golden Elephant Lodge",
      country: "Thailand",
      pricing: "1,000 - 2,500 TH",
      address: "135 Golden Elephant Ave, Ayutthaya, Thailand 13000"
    },
    {
      id: 20,
      img: "https://picsum.photos/300/300",
      name: "Sunrise Beach Retreat",
      country: "Thailand",
      pricing: "500 - 1,000 TH",
      address: "246 Sunrise Beach Rd, Koh Phi Phi, Thailand 81000"
    },
    {
      id: 21,
      img: "https://picsum.photos/300/300",
      name: "Jasmine Garden Inn",
      country: "Thailand",
      pricing: "500 - 1,000 TH",
      address: "357 Jasmine Garden Ln, Chiang Rai, Thailand 57000"
    },
    {
      id: 22,
      img: "https://picsum.photos/300/300",
      name: "Coral Reef Resort",
      country: "Thailand",
      pricing: "5,000 - 7,500 TH",
      address: "468 Coral Reef Ave, Koh Lanta, Thailand 81150"
    },
    {
      id: 23,
      img: "https://picsum.photos/300/300",
      name: "Thai Harmony Hotel",
      country: "Thailand",
      pricing: "2,500 - 5,000 TH",
      address: "579 Thai Harmony Blvd, Bangkok, Thailand 10100"
    },
    {
      id: 24,
      img: "https://picsum.photos/300/300",
      name: "Charming Chiang Mai Resort",
      country: "Thailand",
      pricing: "1,000 - 2,500 TH",
      address: "680 Charming Rd, Chiang Mai, Thailand 50000"
    }
  ];

  async postMail(
    mailDto: mailDto, @Res() res: Response
  ) {
    let { to, from, subject, text } = mailDto

    try {
      await this.mailerService.sendMail({
        to: to,
        from: from,
        subject: subject,
        text: text
      })
      return res.status(HttpStatus.OK).json({ message: "Send success" })
    } catch (error) {
      console.log(error.message)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Can't send" })
    }
  }

  ladingPage(): LandingResponse {
    const shuffled = this.hostels.sort(() => 0.5 - Math.random())
    const randomHostels = shuffled.slice(0, 10)
    return { hostel: randomHostels }
  }

}
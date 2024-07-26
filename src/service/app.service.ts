import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    const port = this.configService.get<string>('PORT');
    console.log(`Server is running on port ${port}`);
  }
  
  getHello(): string {
    return 'Hello World!';
  }
}

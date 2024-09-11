import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hello } from '../entity/hello';


@Injectable()
export class HelloService {
  constructor(
    @InjectRepository(Hello)
    private helloRepository: Repository<Hello>,
  ) {}

  getHello2(): string {
    return 'Hello test pao got!';
  }
}
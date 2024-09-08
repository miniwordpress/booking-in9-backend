import { Controller, Get } from '@nestjs/common';
import { HelloService } from '../service/hello.service';

@Controller('*')
export class HelloController{
    constructor(private readonly helloService: HelloService) {}

    @Get('hello')
    findAll(): string {
        return this.helloService.getHello2();
    }

}

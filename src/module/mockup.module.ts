import { Module } from '@nestjs/common'
import { MockUpController } from 'src/controller/mockup.controller'
import { MockUpService } from 'src/service/mockup.service'

@Module({
  controllers: [MockUpController],
  providers: [MockUpService]
})
export class MockUpModule { }
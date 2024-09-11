import { Module } from '@nestjs/common'
import { MockUpController } from 'src/controller/mockup.controller'

@Module({
  controllers: [MockUpController],
})
export class MockUpModule { }
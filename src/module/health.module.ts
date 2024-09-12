import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from '../controller/health.controller'
import { HttpModule } from '@nestjs/axios';
import { NestModule, MiddlewareConsumer} from '@nestjs/common';
// import { LoggerMiddleware } from 'src/middleware/middleware';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer
      // .apply(LoggerMiddleware)
      // .forRoutes('*');
  }

}
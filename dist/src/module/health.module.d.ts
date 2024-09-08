import { NestModule, MiddlewareConsumer } from '@nestjs/common';
export declare class HealthModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}

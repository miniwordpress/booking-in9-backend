import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction, } from 'express';
//import { Controller, Get, Req } from '@nestjs/common';



@Injectable()
export class OAuthMiddleware implements NestMiddleware {
  use = (req: Request, _: Response, next: NextFunction) => {
    const acceptLanguage = req.headers['accept-language'];
    const authHeader = req.headers['authorization'];


    if (!acceptLanguage) {
      throw new BadRequestException('Invalid Accept-Language header');
    }

    next();

    if (!authHeader) {
      throw new UnauthorizedException('No OAuth token provided booking in9');
    }

    const token = (authHeader as string).split(' ')[1]; // Assuming Bearer token

    // Validate the token here (for example, using JWT or your OAuth provider)
    // You might need to decode and verify it
    let isValidToken = false;

    try {
        isValidToken = this.validateToken(token);
    } catch (error) {
        throw new UnauthorizedException('Token validation failed');
    }

    if (!isValidToken) {
        throw new UnauthorizedException('Invalid OAuth token');
    }

    next();
  }

  validateToken(token: string): boolean {
    // Add your token validation logic here
    // You can integrate with an OAuth provider or use a JWT library
    return token === 'test-token'; // Replace this with actual validation logic
  }
}
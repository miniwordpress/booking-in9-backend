import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { Request } from 'express'
import { SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserContext } from 'src/dto/models/user-context'
import { TokenType } from 'src/enum/token.type'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from 'src/entity/users'
import { Repository } from 'typeorm'
import { TokenPayload } from 'src/dto/models/token-payload'
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: jwtConstants.secret,
      })
      const user = await this.userRepository.findOne(
        { where: { id: payload.id }, relations: ['token'] }
      )
      if (!user.token || payload.tokenType !== TokenType.ACCESS_TOKEN) {
        throw new UnauthorizedException()
      }
      request.user = {
        id: payload.id,
        email: user.email,
        role: user.role,
        tokenType: payload.tokenType
      } as UserContext
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token')
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
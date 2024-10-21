import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Token } from '../entity/token'
import { Repository } from 'typeorm'
import { Users } from '../entity/users'
import { TokenType } from '../enum/token.type'
import * as bcrypt from 'bcrypt'
import { SignInResponse } from 'src/dto/response/sign-in.response'
import { UsersStatus } from 'src/enum/users-status'
import { UserContext } from 'src/dto/models/user-context'
import { TokenExpireException } from 'src/exception/token-expire.exception'
import { InvalidTokenVerifyException } from 'src/exception/invalid-token.exception'
import { UserNotActiveException } from 'src/exception/user-not-active.exception'
import { SignInFailedException } from 'src/exception/sign-in-fail.exception'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>
  ) { }

  @Inject(JwtService)
  private readonly jwtService: JwtService

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new TokenExpireException()
      }
      throw new InvalidTokenVerifyException()
    }
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token)
  }

  async generateTokenVerifyUser(user: Users): Promise<string> {
    const payload = {
      id: user.id,
      tokenType: TokenType.VERIFY_REGISTER
    }
    const token = new Token()
    token.token = this.jwtService.sign(payload, { expiresIn: '2h' })
    token.user = user
    token.type = TokenType.VERIFY_REGISTER
    token.expire_at = new Date(Date.now() + 60 * 60 * 1000)
    token.refresh_time = new Date(Date.now() + (60 * 60 * 1000) * 2)
    token.created_at = new Date()
    token.used_at = new Date()
    await this.tokenRepository.save(token)
    return token.token
  }

  async generateTokenResetPassword(user: Users): Promise<string> {
    const payload = {
      id: user.id,
      tokenType: TokenType.RESET_PASSWORD
    }
    const token = new Token()
    token.token = this.jwtService.sign(payload, { expiresIn: '2h' })
    token.user = user
    token.type = TokenType.RESET_PASSWORD
    token.expire_at = new Date(Date.now() + 60 * 60 * 1000)
    token.refresh_time = new Date(Date.now() + (60 * 60 * 1000) * 2)
    token.created_at = new Date()
    token.used_at = new Date()
    await this.tokenRepository.save(token)
    return token.token
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<SignInResponse> {
    try {
      const user = await this.userRepository.findOne({ where: { email }, relations: ['token'] })
      if (user.status != UsersStatus.ACTIVE) {
        throw new UserNotActiveException()
      }
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new SignInFailedException()
      }
      if (user.token) {
        await this.deleteToken(user)
      }
      const payload = {
        id: user.id,
        tokenType: TokenType.ACCESS_TOKEN
      }
      const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' })
      this.tokenRepository.save({
        token: accessToken,
        user: user,
        type: TokenType.ACCESS_TOKEN,
        expire_at: new Date(Date.now() + 60 * 60 * 1000),
        refresh_time: new Date(Date.now() + (60 * 60 * 1000) * 2),
        created_at: new Date(),
        used_at: new Date(),
      })
      return new SignInResponse(user, accessToken)
    } catch (error) {
      throw error
    }
  }

  async signOut(user: UserContext): Promise<string> {
    try {
      const findUser = await this.userRepository.findOne({ where: { id: user.id } })
      if (findUser) this.deleteToken(findUser)
    } catch (error) {
      throw new InternalServerErrorException('Some thing went wrong!')
    }
    return "Success"
  }

  async deleteToken(user: Users): Promise<void> {
    try {
      await this.tokenRepository.delete({
        user: {
          id: user.id
        }
      })
    } catch (error) {
      throw new UnauthorizedException('Failed to delete token', error.message)
    }
  }
}
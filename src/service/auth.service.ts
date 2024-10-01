import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Token } from '../entity/token'
import { Repository } from 'typeorm'
import { Users } from '../entity/users'
import { TokenType } from '../enum/token.type'
import * as bcrypt from 'bcrypt'
import { SignInResponse } from 'src/dto/response/signin-response'
import { UsersStatus } from 'src/enum/users-status'

const TIME_OUT_TOKEN = new Date(Date.now() + 60 * 60 * 1000)
const TIME_OUT_REFRESH_TOKEN = new Date(Date.now() + (60 * 60 * 1000) * 2)

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
      throw new UnauthorizedException('Failed to verify token', error.message)
    }
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token)
  }

  async generateToken(user: Users): Promise<string> {
    const payload = { user: user.id, type: "VERIFY_TOKEN" }
    const token = new Token()
    token.token = this.jwtService.sign(payload)
    token.user = user
    token.type = TokenType.VERIFY_REGISTER
    token.expire_at = TIME_OUT_TOKEN
    token.refresh_time = TIME_OUT_REFRESH_TOKEN
    token.created_at = new Date(Date.now() + 60 * 60 * 1000)
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
        throw new UnauthorizedException("Sign in failed because status not active")
      }
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException("Failed to sign in: Invalid email or password")
      }
      if (user.token) {
        await this.deleteToken(user)
      }
      const payload = { sub: user.id, iat: new Date().getTime() }
      const accessToken = await this.jwtService.signAsync(payload)

      this.tokenRepository.create({
        token: accessToken,
        user: user,
        type: TokenType.ACCESS_TOKEN,
        expire_at: TIME_OUT_TOKEN,
        refresh_time: TIME_OUT_REFRESH_TOKEN,
        created_at: new Date(),
        used_at: new Date(),
      })
      return new SignInResponse(user, accessToken)
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }

  // async signOut(userId: number): Promise<void> {
  //   try {
  //     return await this.deleteToken(userId, TokenType.ACCESS_TOKEN)
  //   } catch (error) {
  //     throw new UnauthorizedException('Failed to sign out', error.message)
  //   }
  // }

  async refreshAccessToken(userId: number): Promise<Token> {
    try {
      let users = new Users()
      users.id = userId
      const oldToken = (await this.tokenRepository.findOne({
        where: { user: users, type: TokenType.ACCESS_TOKEN },
      }))?.token

      const decodedToken = await this.decodeToken(oldToken)

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token')
      }

      const currentTime = Math.floor(Date.now() / 1000)

      if (decodedToken.expire_at < currentTime) {
        let tokenUpdateRefreshTime = await this.updateRefreshTime(userId)
        if (!tokenUpdateRefreshTime) {
          throw new UnauthorizedException('Failed to update refresh time')
        } else {
          if (tokenUpdateRefreshTime.refresh_time.getTime() < currentTime) {
            throw new UnauthorizedException('Token refresh time is outdated')
          }
        }
      }

      const newPayload = { sub: decodedToken.sub, email: decodedToken.email }

      const newAccessToken = this.jwtService.signAsync(newPayload, {
        expiresIn: '1h',
      })

      const user = await this.userRepository.findOneBy({ id: userId })

      if (user == null) {
        throw new UnauthorizedException('User not found')
      }
      return this.updateAccessToken(userId, await newAccessToken)
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh access token', error.message)
    }
  }

  async updateRefreshTime(userId: number): Promise<Token> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { user: { id: userId }, type: TokenType.ACCESS_TOKEN },
    })

    if (!tokenEntity) {
      throw new Error('Token not found for this user')
    }

    tokenEntity.refresh_time = new Date(Date.now() + 10 * 60 * 1000)
    return await this.tokenRepository.save(tokenEntity)
  }

  async updateAccessToken(userId: number, newAccessToken: string): Promise<Token> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { user: { id: userId }, type: TokenType.ACCESS_TOKEN },
    })

    if (!tokenEntity) {
      throw new Error('Token not found for this user')
    }

    tokenEntity.token = newAccessToken
    tokenEntity.expire_at = new Date(Date.now() + 60 * 60 * 1000)
    tokenEntity.refresh_time = new Date(Date.now() + 10 * 60 * 1000)
    tokenEntity.used_at = new Date()
    return await this.tokenRepository.save(tokenEntity)
  }

  async deleteToken(user: Users): Promise<void> {
    try {
      await this.tokenRepository.delete({
        id: user.token.id,
      })
    } catch (error) {
      throw new UnauthorizedException('Failed to delete token', error.message)
    }
  }
}
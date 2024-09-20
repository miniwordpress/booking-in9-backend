import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../entity/token';
import { Repository } from 'typeorm';
import { UsersAccount } from '../entity/users.account';
import { TokenType } from '../enum/token.type';
import * as bcrypt from 'bcrypt';

const TIME_OUT_TOKEN = new Date(Date.now() + 60 * 60 * 1000);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(UsersAccount)
    private userRepository: Repository<UsersAccount>
  ) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Failed to verify token', error.message);
    }
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async generateToken(usersId: bigint): Promise<string> {
    const payload = { usersId };
    const tokenString = this.jwtService.sign(payload);
    let userData = new UsersAccount();
    userData.id = usersId;

    const token = new Token();
    token.token = tokenString;
    token.users_id = userData;
    token.type = TokenType.VERIFY_REGISTER;
    token.expire_at = TIME_OUT_TOKEN;
    token.created_at = new Date();
    token.used_at = new Date();

    await this.tokenRepository.save(token);

    return tokenString;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<UsersAccount> {

    try {
      const user = await this.userRepository.findOneBy({email: email});
      let passwordHash = await bcrypt.hash(password, 10);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException();
      }

      const payload = { sub: user.id, userData: user };
      const accessToken = await this.jwtService.signAsync(payload);
      const expireAt = new Date();

      expireAt.setHours(expireAt.getHours() + 1);

      const tokenEntity = this.tokenRepository.create({
        token: accessToken,
        users_id: user,
        type: TokenType.ACCESS_TOKEN,
        expire_at: expireAt,
        created_at: new Date(),
        used_at: new Date(),
      });

      await this.tokenRepository.save(tokenEntity);
      await this.deleteToken(user.id, TokenType.VERIFY_REGISTER);

      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async signOut(userId: bigint): Promise<void> { 
    try {
      return await this.deleteToken(userId, TokenType.ACCESS_TOKEN);
    } catch (error) {
      throw new UnauthorizedException('Failed to sign out', error.message);
    }
  }

  async refreshAccessToken(userId: bigint): Promise<Token> {
    try {
      const oldToken = (await this.tokenRepository.findOne({
        where: { id: userId, type: TokenType.ACCESS_TOKEN },
      }))?.token;

      const decodedToken = await this.decodeToken(oldToken);
  
      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }
  
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.expire_at < currentTime) {
        let tokenUpdateRefreshTime = await this.updateRefreshTime(userId);
        if (!tokenUpdateRefreshTime) {
          throw new UnauthorizedException('Failed to update refresh time');
        } else {
            if (tokenUpdateRefreshTime.refresh_time.getTime() < currentTime) {
              throw new UnauthorizedException('Token refresh time is outdated');
            }
        }
      }
  
      const newPayload = { sub: decodedToken.sub, email: decodedToken.email };

      const newAccessToken = this.jwtService.signAsync(newPayload, {
        expiresIn: '1h',
      });

      const user = await this.userRepository.findOneBy({id: userId});

      if (user == null) {
        throw new UnauthorizedException('User not found');
      }
      return this.updateAccessToken(userId, await newAccessToken);
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh access token', error.message);
    }
  }

  async updateRefreshTime(userId: bigint): Promise<Token> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { users_id: { id: userId }, type: TokenType.ACCESS_TOKEN },
    });
  
    if (!tokenEntity) {
      throw new Error('Token not found for this user');
    }

    tokenEntity.refresh_time = new Date(Date.now() + 10 * 60 * 1000);
    return await this.tokenRepository.save(tokenEntity);
  }

  async updateAccessToken(userId: bigint, newAccessToken: string): Promise<Token> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { users_id: { id: userId }, type: TokenType.ACCESS_TOKEN },
    });
  
    if (!tokenEntity) {
      throw new Error('Token not found for this user');
    }
  
    tokenEntity.token = newAccessToken;
    tokenEntity.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    tokenEntity.refresh_time = new Date(Date.now() + 10 * 60 * 1000);
    tokenEntity.used_at = new Date();
    return await this.tokenRepository.save(tokenEntity);
  }

  async deleteToken(userId: bigint, type: TokenType): Promise<void> {
    let user = new UsersAccount();
    user.id = userId;

    try {
      await this.tokenRepository.delete({
        users_id: user,
        type: type,
      });
    } catch (error) {
      throw new UnauthorizedException('Failed to delete token', error.message);
    }
  }
}
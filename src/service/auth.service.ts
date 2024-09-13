import { Injectable, UnauthorizedException } from '@nestjs/common';
//TODO: UsersService auth
import { UsersService } from '../service/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../entity/token';
import { Repository } from 'typeorm';
import { UsersAccount } from '../entity/users.account';
import { TokenType } from '../enum/token.type';

@Injectable()
export class AuthService {
  usersService: any;
  constructor(
    //private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>
  ) {}

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
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
    token.type = TokenType.VERIFY;
    //expiration to 1 hs
    token.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    token.created_at = new Date();
    token.used_at = new Date();

    await this.tokenRepository.save(token);

    return tokenString;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
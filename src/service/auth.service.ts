import { Injectable, UnauthorizedException } from '@nestjs/common';
//TODO: UsersService auth
import { UsersService } from '../service/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/entity/token';
import { Repository } from 'typeorm';
import { UsersAccount } from 'src/entity/users.account';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
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

  async generateToken(users_id: bigint, type: string): Promise<string> {
    const payload = { users_id, type };
    const tokenString = this.jwtService.sign(payload);
    let userData = new UsersAccount();
    userData.id = users_id;

    const token = new Token();
    token.token = tokenString;
    token.users_id = userData;
    token.type = type as TokenType;
    //expiration to 1 h
    token.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    token.created_at = new Date();

    await this.tokenRepository.save(token);

    return tokenString;
  }

//TODO: UsersService auth
//   async signIn(
//     username: string,
//     pass: string,
//   ): Promise<{ access_token: string }> {
//     const user = await this.usersService.findOne(username);
//     if (user?.password !== pass) {
//       throw new UnauthorizedException();
//     }
//     const payload = { sub: user.userId, username: user.username };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     };
//   }
}
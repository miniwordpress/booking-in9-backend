import { TokenType } from "src/enum/token.type";

export class TokenModel {
    userId: number;
    token: string;
    type: TokenType;
    expireAt: Date;
    createdAt: Date;
    usedAt: Date;
 }
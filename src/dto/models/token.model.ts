import { TokenType } from "src/enum/token.type";

export class TokenModel {
    userId: bigint;
    token: string;
    type: TokenType;
    expireAt: Date;
    createdAt: Date;
    usedAt: Date;
 }
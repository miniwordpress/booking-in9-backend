export class TokenResponse {
    id: bigint;
    token: string;
    userId: bigint;
    type: string;
    expireAt: Date;
    createdAt: Date;
    usedAt: Date;
 }
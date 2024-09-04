export class TokenResponse {
    id: bigint;
    token: string;
    user_id: bigint;
    type: string;
    expire_at: Date;
    created_at: Date;
    used_at: Date;
 }
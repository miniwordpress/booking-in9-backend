import { TokenModel } from "../models/token.model";

export class TokenResponse {
    code: string;
    data?: TokenModel[];
    message: string;
    cause?: string;
}
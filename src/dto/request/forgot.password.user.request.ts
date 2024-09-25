import { IsNotEmpty } from "class-validator";

export class ForgotPasswordRequest {
    @IsNotEmpty()
    userId: bigint;
    @IsNotEmpty()
    oldPassword: string;
    @IsNotEmpty()
    newPassword: string;
    @IsNotEmpty()
    verifyPassword: string;
    @IsNotEmpty()
    language: string
}
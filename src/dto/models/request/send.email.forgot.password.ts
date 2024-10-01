import { IsNotEmpty } from "class-validator";
import { Users } from "src/entity/users";

export class SendEmailForgotPasswordRequest {
    @IsNotEmpty()
    userAccount: Users;
    @IsNotEmpty()
    language: string;
    @IsNotEmpty()
    fromAuthor: string;
}
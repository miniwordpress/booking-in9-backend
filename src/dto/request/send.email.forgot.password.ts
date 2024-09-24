import { IsNotEmpty } from "class-validator";
import { UsersAccount } from "src/entity/users.account";

export class SendEmailForgotPasswordRequest {
    @IsNotEmpty()
    userAccount: UsersAccount;
    @IsNotEmpty()
    language: string;
    @IsNotEmpty()
    fromAuthor: string;
}
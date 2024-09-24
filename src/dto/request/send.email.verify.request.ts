import { IsNotEmpty } from "class-validator";
import { UsersAccount } from "src/entity/users.account";

export class SendEmailVerifyRequest {
    @IsNotEmpty()
    userAccount: UsersAccount;
    @IsNotEmpty()
    language: string;
    @IsNotEmpty()
    fromAuthor: string;
}
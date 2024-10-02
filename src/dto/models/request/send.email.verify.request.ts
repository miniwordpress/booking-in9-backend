import { IsNotEmpty } from "class-validator";
import { Users } from "src/entity/users";

export class SendEmailVerifyRequest {
    @IsNotEmpty()
    userAccount: Users;
    @IsNotEmpty()
    token: string;
    @IsNotEmpty()
    language?: string;
    @IsNotEmpty()
    fromAuthor?: string;
    password: string
}
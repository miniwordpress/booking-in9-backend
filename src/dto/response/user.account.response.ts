import { UserAccountModel } from "../models/user.account.model";

export class UsersAccountResponse {
    code: string;
    data?: UserAccountModel[];
    message: string;
    cause?: string;
}
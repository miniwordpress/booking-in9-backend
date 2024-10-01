import { UserAccountModel } from "../models/user.model";

export class UsersAccountResponse {
    code: string;
    data?: UserAccountModel[];
    message: string;
    cause?: string;
}
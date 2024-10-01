import { UsersRole } from "src/enum/users-role"
import { UsersStatus } from "src/enum/users-status"

export class UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    tel?: string;
    img?: string;
    status?: UsersStatus;
    role?: UsersRole;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export class UpdateUserRequest {
    id: bigint;
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
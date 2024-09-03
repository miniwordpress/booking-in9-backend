export class CreateUserRequest {
    id: bigint;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    tel: string;
    id_number: string;
    img: string;
    status: UsersStatus;
    role: UsersRole;
    description: string;
    //TODO: remove this
    updated_at: Date;
}
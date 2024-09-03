export class UserAccountResponse {
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
    created_at: Date;
    updated_at: Date;
  }
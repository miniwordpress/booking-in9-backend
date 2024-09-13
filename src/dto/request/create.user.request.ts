import { IsNotEmpty, IsDate} from 'class-validator';
import { isEmpty } from 'rxjs';

export class CreateUserRequest {
    id?: bigint;

    @IsNotEmpty()
    firstName: string;
    
    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    email: string;

    password?: string;

    @IsNotEmpty()
    tel: string;

    @IsNotEmpty()
    idNumber: string;
    
    img?: string;

    @IsNotEmpty()
    status: UsersStatus;

    @IsNotEmpty()
    role: UsersRole;

    description?: string;

    createdAt?: Date;

    updatedAt?: Date;
}

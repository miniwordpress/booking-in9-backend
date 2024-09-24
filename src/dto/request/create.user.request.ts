import { IsNotEmpty, IsDate} from 'class-validator';
import { isEmpty } from 'rxjs';
import { IDNumberType } from 'src/enum/id.number.type';

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

    @IsNotEmpty()
    idNumberType: IDNumberType;
    
    img?: string;

    @IsNotEmpty()
    status: UsersStatus;

    @IsNotEmpty()
    role: UsersRole;

    @IsNotEmpty()
    language: string;

    description?: string;

    createdAt?: Date;

    updatedAt?: Date;
}

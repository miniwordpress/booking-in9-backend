import { IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import { IDNumberType } from 'src/enum/id.number.type';

export class CreateUserRequest {
    id?: bigint;

    @IsNotEmpty()
    firstName: string;
    
    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(50)
    tel: string;

    @IsNotEmpty()
    idNumber: string;

    @IsNotEmpty()
    idNumberType: IDNumberType;
    
    img?: string;

    description?: string;
}

import { UsersRole } from "src/enum/users-role";
import { UsersStatus } from "src/enum/users-status";

export class UserAccountModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tel: string;
    idNumber: string;
    img: string;
    status: UsersStatus;
    role: UsersRole;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }
import { ForgotPasswordModel } from "../models/forgot.password.model";

export class ForgotPasswordResponse{
    code: string;
    data?: ForgotPasswordModel[];
    message: string;
    cause?: string;
}
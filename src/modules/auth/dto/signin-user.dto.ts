import { IsEmail, IsString } from "class-validator";

export class CredentialsUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
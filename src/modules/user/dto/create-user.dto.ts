import { Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
        @IsString()
        name: string;
    
        @IsString()
        surname: string;
    
        @IsEmail()
        email: string;
    
        @IsOptional()
        @Type(() => Date) 
        @IsDate ()
        birthdate?: Date;
    
        @IsString()
        identificationNumber: string;
    
        @IsOptional()
        @IsString()
        location?: string;
    
        @IsString()
        adress: string;
    
        @IsString()
        phone: string;
    
        @IsString()
        password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @Length(3, 80)
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'jone@example.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    description: 'Fecha de nacimiento del usuario',
    example: '01/03/1999',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Número de identificación personal',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Pais del usuario',
    example: 'Argentina',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Localidad del usuario',
    example: 'Almagro',
  })
  @IsNotEmpty()
  @IsString()
  locality: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Codigo postal',
    example: '1109',
  })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({
    type: String,
    description: 'Dirección del usuario',
    example: 'Almagro, Yatay 567',
  })
  @IsString()
  address: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provincia del usuario',
    example: 'Cordoba',
  })
  @IsString()
  location: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Número de télefono',
    example: '1134256282',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Contraseña del usuario',
    example: 'Jhon1234@',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Matches(/[!@#$%^&*]/, {
    message:
      'La contraseña debe contener al menos un carácter especial: !@#$%^&*',
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'Prefijo',
    example: '+54 por defecto ese es su valor',
  })
  @IsOptional()
  @IsString()
  coverage?: string;
}

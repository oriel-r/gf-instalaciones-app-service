import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FormContactDto {
  /* title: 'Remitente'
  description: 'Dirección del usuario'
  example: 'user1@example.com' */
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  from: string;

  /* title: 'Asunto';
  description: 'Nombre del usuario';
  example: 'Jhon'; */
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  surname?: string;

  /* title: 'Mensaje';
  description: 'Contenido del mail';
  example: 'Pregunta acerca de precios'; */
  @IsString()
  @IsNotEmpty()
  message: string;
}

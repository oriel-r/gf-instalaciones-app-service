import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SendEmailDto {
  /*   title: 'Remitente';
  description: 'Dirección de correo electrónico del remitente del mensaje';
  example: 'notificaciones@gf-instalaciones.com'; */

  @IsString()
  @IsEmail()
  @IsOptional()
  from?: string;

  /* title: 'Destinatarios';
  description: 'Lista de direcciones de correo electrónico de los destinatarios del mensaje';
  example: ['user1@example.com', 'user2@example.com']; */
  @ValidateIf((o) => typeof o.to === 'string')
  @IsEmail({}, { each: true })
  @IsOptional()
  to?: string | string[];

  /* title: 'Asunto';
  description: 'Asunto descriptivo del mail';
  example: 'Notificación acerca de cambios en precios'; */
  @IsString()
  @IsNotEmpty()
  subject: string;

  /* title: 'Mensaje';
  description: 'Contenido del mail';
  example: 'Tenemos nuevos precios'; */
  @IsString()
  @IsNotEmpty()
  message: string;
}

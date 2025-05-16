import {
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class RecoveryChangePasswordDto {
  @IsString()
  token: string;

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
  newPassword: string;
}

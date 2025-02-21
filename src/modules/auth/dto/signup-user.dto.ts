import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class ExtendedUserDto extends CreateUserDto {
   @ApiProperty({
          type: String,
          required: true,
          description: 'Confimación de la contraseña del usuario',
          example: 'Jhon1234@',
        })
  @IsString()
  @IsNotEmpty()
  repeatPassword: string;
}

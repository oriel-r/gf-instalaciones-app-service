import { IsString } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class ExtendedUserDto extends CreateUserDto {
  @IsString()
  confirmPassword: string;
}

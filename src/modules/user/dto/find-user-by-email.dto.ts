import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class FindUserByEmailDto extends PickType(CreateUserDto, [
  'email' as const,
]) {}

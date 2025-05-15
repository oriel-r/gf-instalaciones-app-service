import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleDto } from 'src/modules/user/dto/role.dto';

export class UserRoleDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @Type(() => RoleDto)
  @ApiProperty({ type: () => RoleDto })
  role: RoleDto;
}

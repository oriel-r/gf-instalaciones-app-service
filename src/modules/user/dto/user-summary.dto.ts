import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleDto } from 'src/modules/user-role/dto/user-role.dto';
import { Installer } from 'src/modules/installer/entities/installer.entity';

export class UserSummaryDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  birthDate: Date;

  @ApiProperty()
  @Expose()
  idNumber: string;

  @ApiProperty()
  @Expose()
  country: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  location: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty({ required: false })
  @Expose()
  coverage?: string;

  @ApiProperty({ required: false })
  @Expose()
  disabledAt?: Date | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  isSubscribed?: boolean;

  @Expose()
  @Type(() => UserRoleDto)
  @ApiProperty({
    type: () => [UserRoleDto],
    description: 'Roles asignados al usuario',
  })
  userRoles: UserRoleDto[];

  @Expose()
  installer: Installer
}

import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AdminBasicDto } from 'src/modules/admins/dto/admin-basic.dto';
import { CoordinatorBasicDto } from 'src/modules/coordinators/dto/coordinator-basic.dto';
import { InstallerBasicDto } from 'src/modules/installer/dto/installer-basic.dto';
import { UserRoleDto } from 'src/modules/user-role/dto/user-role.dto';
import { Installer } from 'src/modules/installer/entities/installer.entity';

export class UserWithRolesDto {
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
  locality: string;

  @ApiProperty()
  @Expose()
  postalCode: string;

  @ApiProperty({ required: false })
  @Expose()
  coverage?: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  isSubscribed?: boolean;

  @ApiProperty({ required: false })
  @Expose()
  disabledAt?: Date | null;

  @Expose()
  @Type(() => UserRoleDto)
  @ApiProperty({
    type: () => [UserRoleDto],
    description: 'Roles asignados al usuario',
  })
  userRoles: UserRoleDto[];

  @Expose()
  @Type(() => Installer)
  installer?: Installer | null;

  @ApiProperty({ type: () => CoordinatorBasicDto, required: false })
  @Expose()
  @Type(() => CoordinatorBasicDto)
  coordinator?: CoordinatorBasicDto | null;

  @ApiProperty({ type: () => AdminBasicDto, required: false })
  @Expose()
  @Type(() => AdminBasicDto)
  admin?: AdminBasicDto | null;
}

import { ApiProperty } from '@nestjs/swagger';
import { AdminBasicDto } from 'src/modules/admins/dto/admin-basic.dto';
import { CoordinatorBasicDto } from 'src/modules/coordinators/dto/coordinator-basic.dto';
import { InstallerBasicDto } from 'src/modules/installer/dto/installer-basic.dto';

export class UserWithRolesDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  idNumber: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  location: string;

  @ApiProperty({ required: false })
  coverage?: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  isSubscribed?: boolean;

  @ApiProperty({ required: false })
  disabledAt?: Date | null;

  @ApiProperty({
    type: () => [Object],
  })
  userRoles: {
    id: string;
    role: {
      id: string;
      name: string;
    };
  }[];

  @ApiProperty({ type: () => InstallerBasicDto, required: false })
  installer?: InstallerBasicDto | null;

  @ApiProperty({ type: () => CoordinatorBasicDto, required: false })
  coordinator?: CoordinatorBasicDto | null;

  @ApiProperty({ type: () => AdminBasicDto, required: false })
  admin?: AdminBasicDto | null;
}


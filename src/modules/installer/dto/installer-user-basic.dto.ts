import { ApiProperty } from '@nestjs/swagger';

export class InstallerUserBasicDto {
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
}

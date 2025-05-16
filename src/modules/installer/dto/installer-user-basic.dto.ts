import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class InstallerUserBasicDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  birthDate: Date;

  @Expose()
  @ApiProperty()
  idNumber: string;

  @Expose()
  @ApiProperty()
  country: string;

  @Expose()
  @ApiProperty()
  address: string;

  @Expose()
  @ApiProperty()
  location: string;

  @Expose()
  @ApiProperty({ required: false })
  coverage?: string;

  @Expose()
  @ApiProperty()
  phone: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty({ required: false })
  isSubscribed?: boolean;

  @Expose()
  @ApiProperty({ required: false })
  disabledAt?: Date | null;

  @Expose()
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


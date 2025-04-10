import { ApiProperty } from '@nestjs/swagger';

export class InstallerBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  disabledAt?: Date | null;
}

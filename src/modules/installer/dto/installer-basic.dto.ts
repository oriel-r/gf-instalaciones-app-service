import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { InstallerResponseDto } from './installer-response.dto';
import { StatusInstaller } from 'src/common/enums/status-installer';

export class InstallerBasicDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ required: false })
  disabledAt?: Date | null;

  @Expose()
  @ApiProperty()
  status: StatusInstaller
}

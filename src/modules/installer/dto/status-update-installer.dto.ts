import { IsEnum } from 'class-validator';
import { StatusInstaller } from 'src/common/enums/status-installer';

export class StatusInstallerDto {
  @IsEnum(StatusInstaller)
  status: StatusInstaller;
}

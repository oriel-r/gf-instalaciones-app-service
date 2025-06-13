import { IsEnum } from 'class-validator';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';

export class StatusChangeDto {
  @IsEnum(InstallationStatus)
  status: InstallationStatus;
}

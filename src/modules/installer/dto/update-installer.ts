import { PartialType } from '@nestjs/mapped-types';
import { CreateInstallerDto } from './create-installer.dto';
import { StatusInstaller } from 'src/common/enums/status-installer';

export class UpdateInstallerDto extends PartialType(CreateInstallerDto) {
    status?: StatusInstaller;
}
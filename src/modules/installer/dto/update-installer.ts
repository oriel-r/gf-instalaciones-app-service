import { PartialType } from '@nestjs/mapped-types';
import { CreateInstallerDto } from './create-installer.dto';
import { Exclude } from 'class-transformer';

export class UpdateInstallerDto extends PartialType(CreateInstallerDto) {
  @Exclude()
  status: never;
}

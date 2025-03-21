import { PartialType } from '@nestjs/mapped-types';
import { CreateInstallationDto } from './create-installation.dto';

export class UpdateInstallationDto extends PartialType(CreateInstallationDto) {}

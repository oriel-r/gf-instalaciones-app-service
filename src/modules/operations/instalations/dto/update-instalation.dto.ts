import { PartialType } from '@nestjs/mapped-types';
import { CreateInstalationDto } from './create-instalation.dto';

export class UpdateInstalationDto extends PartialType(CreateInstalationDto) {}

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateInstallationDto } from './create-installation.dto';
import { InstallationDataRequesDto } from '../../orders/dto/installation-data.request.dto';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';

export class UpdateInstallationDto extends PartialType(OmitType(InstallationDataRequesDto, ['coordinatorId', 'address'])) {}

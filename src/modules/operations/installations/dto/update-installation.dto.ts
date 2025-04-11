import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateInstallationDto } from './create-installation.dto';
import { InstallationDataRequesDto } from '../../orders/dto/installation-data.request.dto';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { IsISO8601 } from '@nestjs/class-validator';

export class UpdateInstallationDto {

    @IsOptional()
    @IsISO8601()
    startDate: string

    @IsOptional()
    @IsArray()
    installersIds: string[]
}

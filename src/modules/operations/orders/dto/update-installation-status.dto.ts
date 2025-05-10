import { IsEnum, IsISO8601 } from "class-validator";
import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseDto } from "src/common/entities/base.dto";
import { InstallationStatus } from "src/common/enums/installations-status.enum";
import { Transform } from "class-transformer";

export class UpdateInstallationStatus extends BaseDto {

    @ApiProperty({
        title: 'startDate',
        description: 'An ISO8601 date: 2025-03-15T11:30:00'
    })
    @IsOptional()
    @IsISO8601()
    @Transform(({ value }) => new Date(value))
    startDate: Date

    @ApiProperty({
        title: 'status',
        description: 'new status'
    })
    @IsNotEmpty()
    @IsEnum(InstallationStatus)
    status: InstallationStatus
    
}
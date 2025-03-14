import { IsEnum } from "@nestjs/class-validator";
import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "src/common/entities/base.dto";
import { InstalationStatus } from "src/common/enums/instalations-status.enum";

export class UpdateInstalationStatus extends BaseDto {

    @ApiProperty({
        title: 'status',
        description: 'new status'
    })
    @IsNotEmpty()
    @IsEnum(InstalationStatus)
    status: InstalationStatus
    
}
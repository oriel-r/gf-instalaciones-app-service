import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { BaseQueryOptions } from "src/common/entities/query-options.dto";
import { Sort } from "src/common/enums/sort.dto";
import { IsNull } from "typeorm";

export class OrderQueryOptionsDto extends BaseQueryOptions {

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
      })
    completed: Boolean | undefined = undefined

    @IsOptional()
    @IsEnum(Sort)
    progress: Sort | undefined = undefined
}
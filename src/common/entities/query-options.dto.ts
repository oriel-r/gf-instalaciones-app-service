import { Type } from "class-transformer";
import { IsOptional, IsString, IsInt } from "class-validator";
import { Sort } from "../enums/sort.dto";

export class BaseQueryOptions {
    
    @IsOptional()
    @IsString()
    createdAt: Sort | undefined = undefined
    
    @IsOptional()
    @IsString()
    updatedAt: Sort | undefined = undefined
    
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page: number 
    
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit: number 

}   
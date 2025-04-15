import { IsInt } from "@nestjs/class-validator";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { SortDirection } from "typeorm";
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
import { BaseDto } from "src/common/entities/base.dto";
import { User } from "../entities/user.entity";
import { IsOptional } from "class-validator";
import { BaseQueryOptions } from "src/common/entities/query-options.dto";
import { IsEnum } from "@nestjs/class-validator";
import { RoleEnum } from "src/common/enums/user-role.enum";

export class UserQueryOptions extends BaseQueryOptions {
    @IsOptional()
    @IsEnum(RoleEnum)
    role: RoleEnum
}
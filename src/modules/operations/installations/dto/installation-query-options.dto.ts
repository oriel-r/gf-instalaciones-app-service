import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryOptions } from 'src/common/entities/query-options.dto';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';
import { Provinces } from 'src/common/enums/provinces.enum';

export class InstallationQueryOptionsDto extends BaseQueryOptions {
  @IsOptional()
  @IsEnum(InstallationStatus)
  status: InstallationStatus | undefined = undefined;

  @IsOptional()
  @IsEnum(Provinces)
  province: Provinces | undefined = undefined;

  @IsOptional()
  @IsString()
  city: string | undefined = undefined;
}

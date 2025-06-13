import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common/entities/base.dto';

export class CreateCityDto extends BaseDto {
  @ApiProperty({
    title: 'name',
    description: 'the name of a city',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    title: 'province',
    description: 'the name of the province where is this city',
  })
  @IsNotEmpty()
  @IsString()
  province: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProvinceDto {
  @ApiProperty({
    title: 'name',
    description: "province's name",
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

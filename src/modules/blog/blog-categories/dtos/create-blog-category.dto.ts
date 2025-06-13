import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/entities/base.dto';

export class CreateCategoryDto extends BaseDto {
  @ApiProperty({
    title: 'name',
    description: "category's name",
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: 'description',
    description: "category's description",
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

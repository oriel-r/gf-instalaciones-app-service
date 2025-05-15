import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AdminBasicDto {
  @Expose()
  @ApiProperty()
  id: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CoordinatorBasicDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ required: false })
  disabledAt?: Date | null;
}

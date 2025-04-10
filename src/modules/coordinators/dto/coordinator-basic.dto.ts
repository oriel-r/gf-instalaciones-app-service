import { ApiProperty } from '@nestjs/swagger';

export class CoordinatorBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  disabledAt?: Date | null;
}

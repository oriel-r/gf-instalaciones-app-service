import { ApiProperty } from '@nestjs/swagger';

export class AdminBasicDto {
  @ApiProperty()
  id: string;
}

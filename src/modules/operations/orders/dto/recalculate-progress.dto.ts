import { IsNotEmpty, IsString } from 'class-validator';

export class RecalculateProgressDto {
  @IsNotEmpty()
  @IsString()
  orderId: string | string[];

  constructor(id: string | string[]) {
    this.orderId = id;
  }
}

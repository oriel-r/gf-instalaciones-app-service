import { BaseDto } from 'src/common/entities/base.dto';
import { Installation } from '../../installations/entities/installation.entity';
import { Order } from '../entities/order.entity';
import { GetInstallationsDto } from '../../installations/dto/get-installations-response.dto';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { ISOStringFormat } from 'date-fns';
import { User } from 'src/modules/user/entities/user.entity';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class GetOrderResponseDto {
  @IsString()
  id: string;

  @IsString()
  orderNumber: string;

  @IsString()
  description: string;

  @IsString()
  title: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  installationsFinished: string;

  @IsNumber()
  progress: number;

  client: User[] | null;
  installations?: GetInstallationsDto[] | void[];
  @IsDate()
  createdAt: Date;

  @IsDate()
  finishedAt: Date | null;

  constructor(data: Order) {
    this.id = data.id;
    this.orderNumber = data.orderNumber;
    this.title = data.title;
    this.client = data.client && data.client.map((client) => client.user);
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.finishedAt = data.finishedAt;
    this.progress = data.progress;
    this.completed = data.completed;
    this.installationsFinished = data.installationsFinished;
    this.installations = data.installations.map(
      (installation) => new GetInstallationsDto(installation),
    );
  }
}

import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class AssignRoleDto {
  @Expose()
  @IsUUID()
  userId: string;

  @Expose()
  @IsUUID()
  roleId: string;
}

import { UserRole } from 'src/modules/user-role/entities/user-role.entity';

export class RolePayload {
  name: string;
  id: string;

  constructor(data: UserRole) {
    (this.name = data.role.name), (this.id = data.id);
  }
}

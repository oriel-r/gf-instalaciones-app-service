import { Installer } from 'src/modules/installer/entities/installer.entity';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';
import { Admin } from 'src/modules/admins/entities/admins.entity';

export class UserWithRolesDto {
  id: string;
  fullName: string;
  email: string;
  birthDate: Date;
  idNumber: string;
  country: string;
  address: string;
  location: string;
  coverage?: string;
  phone: string;
  createdAt: Date;
  isSubscribed?: boolean;
  disabledAt?: Date;

  userRoles: {
    id: string;
    role: {
      id: string;
      name: string;
    };
  }[];

  installer?: Installer | null;
  coordinator?: Coordinator | null;
  admin?: Admin | null;
}

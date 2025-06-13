import { Injectable } from '@nestjs/common';
import { appDataSource } from 'src/config/data-source';
import { hash } from 'bcrypt';
import { Role } from 'src/modules/user/entities/roles.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { Admin } from 'src/modules/admins/entities/admins.entity';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';
import { usersData }  from './users.mock';
import { StatusInstaller } from 'src/common/enums/status-installer';

@Injectable()
export class UserSeeds {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) await appDataSource.initialize();

    await appDataSource.transaction(async manager => {
      // 1) Roles (crea los que falten)
      const roleNames = ['Admin', 'Coordinador', 'Instalador', 'Usuario'];
      const roles: Record<string, Role> = {};

      for (const name of roleNames) {
        roles[name] =
          (await manager.findOne(Role, { where: { name } })) ??
          (await manager.save(manager.create(Role, { name })));
      }

      // 2) Usuarios mock (crea solo los que no existan por email)
      for (const mock of usersData) {
        const exists = await manager.findOne(User, {
          where: { email: mock.email },
        });
        if (exists) continue; // ← evita duplicados

        const { userRoles, password, ...userProps } = mock;
        const user = manager.create(User, {
          ...userProps,
          password: await hash(password, 10),
        });
        await manager.save(user);

        await manager.save(
          manager.create(UserRole, { user, role: roles[userRoles] }),
        );

        if (userRoles === 'Instalador') {
          await manager.save(
            manager.create(Installer, {
              user,
              ...mock, // taxCondition, flags, etc.
              status: StatusInstaller.Approved,
            }),
          );
        } else if (userRoles === 'Admin') {
          await manager.save(manager.create(Admin, { user }));
        } else if (userRoles === 'Coordinador') {
          await manager.save(manager.create(Coordinator, { user }));
        }
      }

      console.log('✔ UserSeeds: completos (idempotente)');
    });
  }
}

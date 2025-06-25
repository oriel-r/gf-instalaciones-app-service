import { Injectable } from '@nestjs/common';
import { appDataSource } from 'src/config/data-source';
import { hash } from 'bcrypt';

import { Role } from 'src/modules/user/entities/roles.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { Admin } from 'src/modules/admins/entities/admins.entity';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';

import { usersData } from './users.mock';
import { StatusInstaller } from 'src/common/enums/status-installer';

/**
 * Seeder de usuarios.
 *
 * * En **cualquier** entorno:
 *   - Crea los roles que falten (Admin, Coordinador, Instalador, Usuario).
 *
 * * En entorno **CLOUD** (`process.env.ENVIRONMENT === 'CLOUD'`):
 *   - Si ya existe **al menos un** usuario con rol **Admin** → no hace nada más.
 *   - Si **no** existe un Admin → crea **solo** el primer usuario con rol *Admin*
 *     definido en `users.mock`.
 *
 * * En cualquier otro entorno:
 *   - Se comporta igual que antes: recorre `users.mock` completo
 *     y crea los usuarios que no existan (idempotente).
 */
@Injectable()
export class UserSeeds {
  private readonly isCloudEnv = (process.env.ENVIRONMENT ?? '').toUpperCase() === 'CLOUD';

  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) await appDataSource.initialize();

    await appDataSource.transaction(async (manager) => {
      /* ------------------------------------------------------------------ */
      /* 1) ROLES – crea los que falten                                    */
      /* ------------------------------------------------------------------ */
      const roleNames = ['Admin', 'Coordinador', 'Instalador', 'Usuario'];
      const roles: Record<string, Role> = {};

      for (const name of roleNames) {
        roles[name] =
          (await manager.findOne(Role, { where: { name } })) ??
          (await manager.save(manager.create(Role, { name })));
      }

      /* ------------------------------------------------------------------ */
      /* 2) ENTORNO CLOUD – ¿ya existe un Admin?                            */
      /* ------------------------------------------------------------------ */
      if (this.isCloudEnv) {
        const adminExists = await manager
          .createQueryBuilder(UserRole, 'ur')
          .innerJoin('ur.role', 'role')
          .where('role.name = :name', { name: 'Admin' })
          .getCount();

        if (adminExists > 0) {
          console.log('✔ UserSeeds (CLOUD): ya existe un Admin, nada que sembrar');
          return; // ← aborta el seeder (roles ya están)
        }
      }

      /* ------------------------------------------------------------------ */
      /* 3) Selección de datos a sembrar según entorno                      */
      /* ------------------------------------------------------------------ */
      const dataToSeed = this.isCloudEnv
        ? usersData.filter((u) => u.userRoles === 'Admin').slice(0, 1) // solo el primer Admin
        : usersData;

      /* ------------------------------------------------------------------ */
      /* 4) CREACIÓN DE USUARIOS                                            */
      /* ------------------------------------------------------------------ */
      for (const mock of dataToSeed) {
        // evita duplicados por email
        const exists = await manager.findOne(User, { where: { email: mock.email } });
        if (exists) continue;

        const { userRoles, password, ...userProps } = mock;

        const user = manager.create(User, {
          ...userProps,
          password: await hash(password, 10),
        });
        await manager.save(user);

        await manager.save(manager.create(UserRole, { user, role: roles[userRoles] }));

        switch (userRoles) {
          case 'Instalador':
            await manager.save(
              manager.create(Installer, {
                user,
                ...mock, // taxCondition, flags, etc.
                status: StatusInstaller.Approved,
              }),
            );
            break;

          case 'Admin':
            await manager.save(manager.create(Admin, { user }));
            break;

          case 'Coordinador':
            await manager.save(manager.create(Coordinator, { user }));
            break;

          // Usuarios comunes no requieren entidad adicional
        }
      }

      console.log(
        `✔ UserSeeds: completados (${this.isCloudEnv ? 'CLOUD' : 'LOCAL/DEV'}) – idempotente`,
      );
    });
  }
}

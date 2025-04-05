import { appDataSource } from 'src/config/data-source';
import { hash } from 'bcrypt';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { Role } from 'src/modules/user/entities/roles.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';

import { usersData } from './users.mock';

export class UserSeeds {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    await appDataSource.transaction(async (manager) => {

      const userCount = await manager.count(User);
      if (userCount > 0) {
        console.log('Users already seeded!');
        return;
      }

      const roleNames = ['Admin', 'Coordinador', 'Instalador', 'Usuario'];
      const roles: Record<string, Role> = {};
      for (const name of roleNames) {
        let role = await manager.findOne(Role, { where: { name } });
        if (!role) {
          role = manager.create(Role, { name });
          await manager.save(role);
        }
        roles[name] = role;
      } 

      for (const userData of usersData) {
        const { userRoles, password, ...userProps } = userData;
        const hashedPassword = await hash(password, 10);
        const user = manager.create(User, { 
          ...userProps, 
          password: hashedPassword,
        });
        await manager.save(user);

        const userRole = manager.create(UserRole, {
          user,
          role: roles[userRoles],
        });
        await manager.save(userRole);

        if (userRoles === 'Instalador') {
          const installer = manager.create(Installer, {
            ...user, // Copiamos todas las propiedades del usuario
            taxCondition: userData.taxCondition,
            hasPersonalAccidentInsurance: userData.hasPersonalAccidentInsurance,
            canWorkAtHeight: userData.canWorkAtHeight,
            canTensionFrontAndBackLonas: userData.canTensionFrontAndBackLonas,
            canInstallCorporealSigns: userData.canInstallCorporealSigns,
            canInstallFrostedVinyl: userData.canInstallFrostedVinyl,
            canInstallVinylOnWallsOrGlass: userData.canInstallVinylOnWallsOrGlass,
            canDoCarWrapping: userData.canDoCarWrapping,
            hasOwnTransportation: userData.hasOwnTransportation,
          });
          await manager.save(installer);
        }
      }

      console.log('Users and roles seeded successfully');
    });
  }
}

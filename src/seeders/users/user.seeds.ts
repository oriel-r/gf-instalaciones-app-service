import { Injectable } from '@nestjs/common';
import { appDataSource } from 'src/config/data-source';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/entities/roles.entity';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { usersData } from './users.mock';
import { hash } from 'bcrypt';

@Injectable()
export class UsersSeeds {
  async seed(): Promise<void> {
    try {
      if (!appDataSource.isInitialized) {
        await appDataSource.initialize();
      }

      await appDataSource.transaction(async (manager) => {
        const userRepo = manager.getRepository(User);
        const roleRepo = manager.getRepository(Role);
        const installerRepo = manager.getRepository(Installer);

        const userCount = await userRepo.count();
        if (userCount > 0) {
          console.log('No se cargaron usuarios: ya existen registros.');
          return;
        }

        const adminRole = await roleRepo.save({ name: 'Admin' });
        const coordinadorRole = await roleRepo.save({ name: 'Coordinador' });
        const instaladorRole = await roleRepo.save({ name: 'Instalador' });
        const userRole = await roleRepo.save({ name: 'Usuario' });

        for (const userData of usersData) {
          const { role, ...rest } = userData;
          let assignedRole: Role;

          switch (role) {
            case 'Admin':
              assignedRole = adminRole;
              break;
            case 'Coordinador':
              assignedRole = coordinadorRole;
              break;
            case 'Instalador':
              assignedRole = instaladorRole;
              break;
            default:
              assignedRole = userRole;
          }

          const hashedPassword = await hash(userData.password, 10);
          const birthDate = new Date(userData.birthDate);

          const user = userRepo.create({
            ...rest,
            email: userData.email,
            password: hashedPassword,
            role: assignedRole,
            birthDate,
          });
          const savedUser = await userRepo.save(user);

          if (role === 'Instalador') {
            const installer = installerRepo.create({
              taxCondition: userData.taxCondition,
              hasPersonalAccidentInsurance: userData.hasPersonalAccidentInsurance,
              canWorkAtHeight: userData.canWorkAtHeight,
              canTensionFrontAndBackLonas: userData.canTensionFrontAndBackLonas,
              canInstallCorporealSigns: userData.canInstallCorporealSigns,
              canInstallFrostedVinyl: userData.canInstallFrostedVinyl,
              canInstallVinylOnWallsOrGlass: userData.canInstallVinylOnWallsOrGlass,
              canDoCarWrapping: userData.canDoCarWrapping,
              hasOwnTransportation: userData.hasOwnTransportation,
              user: savedUser,
            });
            await installerRepo.save(installer);
          }
        }
        console.log('users preload succesfully.');
      });
    } catch (error) {
      console.error('error in users peload process:', error);
    }
  }
}

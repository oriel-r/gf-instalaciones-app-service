// src/seeders/orders/orders.seeds.ts
import { appDataSource } from 'src/config/data-source';
import { Order }           from 'src/modules/operations/orders/entities/order.entity';
import { Installation }    from 'src/modules/operations/installations/entities/installation.entity';
import { Address }         from 'src/modules/locations/address/entities/address.entity';
import { UserRole }        from 'src/modules/user-role/entities/user-role.entity';
import { Installer }       from 'src/modules/installer/entities/installer.entity';
import { ordersMock, createInstallationMocks } from './orders.mock';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersSeeder {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    await appDataSource.transaction(async manager => {
      // 1) Direcciones
      const allAddresses = await manager.find(Address, { relations: ['city'] });
      if (!allAddresses.length) throw new Error('No hay direcciones');

      // 2) Usuarios/roles/instaladores
      const allRoles       = await manager.find(UserRole,   { relations: ['role','user'] });
      const clientsPool    = allRoles.filter(ur => ur.role.name === 'Usuario');
      const coordsPool     = allRoles.filter(ur => ur.role.name === 'Coordinador');
      const installersList = await manager.find(Installer,   { relations: ['user'] });

      if (!clientsPool.length || !coordsPool.length || !installersList.length) {
        throw new Error('Falta clients, coordinators o installers');
      }

      // 3) Crear Orders con ARRAY de clients
      const orders = ordersMock.map(data => {
        const shuffled = [...clientsPool].sort(() => 0.5 - Math.random());
        const pick     = shuffled.slice(0, Math.floor(Math.random()*3)+1); // 1–3
        return manager.create(Order, {
          ...data,
          client: pick,
          progress: 0,
          installationsFinished: '0/0',
          completed: false,
          endDate: null,
          finishedAt: null,
        });
      });
      const savedOrders = await manager.save(orders);

      // 4) Para cada order, crear installations
      const installationsToInsert = savedOrders.flatMap(order => {
        const count = Math.floor(Math.random()*10)+1; // 1–10
        const mocks = createInstallationMocks(order.title, count);

        // decidir completitud
        const rnd = Math.random();
        let completedCount = 0, isDone = false;
        if (rnd < 0.33) {
          isDone = true; completedCount = count;
          order.completed = true; order.progress = 100;
        } else if (rnd < 0.66) {
          completedCount = count>1
            ? Math.floor(Math.random()*(count-1))+1
            : 0;
          order.completed = false;
          order.progress = +(completedCount/count*100).toFixed(2);
        } else {
          order.completed = false; order.progress = 0; completedCount = 0;
        }
        order.installationsFinished = `${completedCount}/${count}`;
        order.endDate     = (isDone||completedCount>0)? new Date(): null;
        order.finishedAt  = order.endDate;

        return mocks.map((mock, idx) => {
          // convertir startDate ISO -> Date
          const startDt = new Date(mock.startDate);

          // fechas de transición
          const startedAt            = mock.status !== InstallationStatus.PENDING
            ? startDt
            : null;
          const submittedForReviewAt = mock.status === InstallationStatus.TO_REVIEW
            ? new Date(startDt.getTime() + 1000 * 60 * 60 * 24 * 1)
            : null;
          const endDate             = mock.status === InstallationStatus.FINISHED
            ? new Date(startDt.getTime() + 1000 * 60 * 60 * 24 * 2)
            : undefined;

          // imágenes solo para TO_REVIEW o FINISHED
          const images = (mock.status === InstallationStatus.TO_REVIEW ||
                          mock.status === InstallationStatus.FINISHED)
            ? mock.images
            : null;

          const address     = allAddresses[Math.floor(Math.random()*allAddresses.length)];
          const coordinator = [...coordsPool]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random()*2)+1); // 1–2
          const installers  = [...installersList]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random()*3)+1); // 1–3

          // Partial<Installation> con solo campos no nulos
          const partial: Partial<Installation> = {
            status: mock.status,
            startDate: startDt,
            order,
            address,
            coordinator,
            installers,
            startedAt,
            submittedForReviewAt,
            endDate,
            notes: mock.notes,
            images,
          };

          return manager.create(Installation, partial);
        });
      });

      await manager.save(installationsToInsert);
      await manager.save(savedOrders);
      console.log('Seeding completo Orders + Installations');
    });
  }
}

import { Injectable } from '@nestjs/common';
import { appDataSource } from 'src/config/data-source';

import { Order } from 'src/modules/operations/orders/entities/order.entity';
import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { Installer } from 'src/modules/installer/entities/installer.entity';

import { ordersMock, createInstallationMocks } from './orders.mock';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';

@Injectable()
export class OrdersSeeder {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) await appDataSource.initialize();

    await appDataSource.transaction(async (manager) => {
      // 1) Salir si ya hay órdenes
      if (await manager.count(Order)) {
        console.log('Orders already seeded');
        return;
      }

      // 2) Dependencias necesarias
      const addresses = await manager.find(Address);
      const clientsPool = await manager.find(UserRole, {
        where: { role: { name: 'Usuario' } },
        relations: ['user', 'role'],
      });
      const coordsPool = await manager.find(UserRole, {
        where: { role: { name: 'Coordinador' } },
        relations: ['user', 'role'],
      });
      const installers = await manager.find(Installer, { relations: ['user'] });

      if (
        !addresses.length ||
        !clientsPool.length ||
        !coordsPool.length ||
        !installers.length
      ) {
        console.warn('OrdersSeeder skipped: faltan datos previos');
        return;
      }

      // 3) Crear Orders
      const orders = ordersMock.map((data) => {
        const shuffled = [...clientsPool].sort(() => 0.5 - Math.random());
        const pick = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
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

      // 4) Crear Installations por cada Order
      const installs: Installation[] = [];
      savedOrders.forEach((order) => {
        const count = Math.floor(Math.random() * 10) + 1;
        const mocks = createInstallationMocks(order.title, count);

        // actualizar % progreso y flags de la order
        const rnd = Math.random();
        let completedCnt = 0;
        if (rnd < 0.33) {
          // done
          completedCnt = count;
          order.completed = true;
          order.progress = 100;
        } else if (rnd < 0.66) {
          // half
          completedCnt =
            count > 1 ? Math.floor(Math.random() * (count - 1)) + 1 : 0;
          order.progress = +((completedCnt / count) * 100).toFixed(2);
        }

        order.installationsFinished = `${completedCnt}/${count}`;
        if (completedCnt) order.endDate = new Date();

        mocks.forEach((mock) => {
          const startDt = new Date(mock.startDate);
          installs.push(
            manager.create(Installation, {
              status: mock.status,
              startDate: startDt,
              order,
              address: addresses[Math.floor(Math.random() * addresses.length)],
              coordinator: [...coordsPool]
                .sort(() => 0.5 - Math.random())
                .slice(0, 2),
              installers: [...installers]
                .sort(() => 0.5 - Math.random())
                .slice(0, 3),
              startedAt:
                mock.status !== InstallationStatus.PENDING
                  ? startDt
                  : undefined,
              submittedForReviewAt:
                mock.status === InstallationStatus.TO_REVIEW
                  ? new Date(+startDt + 86_400_000)
                  : undefined,
              endDate:
                mock.status === InstallationStatus.FINISHED
                  ? new Date(+startDt + 172_800_000)
                  : undefined,
              notes: mock.notes,
              images:
                mock.status === InstallationStatus.TO_REVIEW ||
                mock.status === InstallationStatus.FINISHED
                  ? mock.images
                  : null,
            }),
          );
        });
      });

      await manager.save(installs);
      await manager.save(savedOrders);
      console.log('✔ Orders + Installations seeded');
    });
  }
}

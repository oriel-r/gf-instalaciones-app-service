/* import { appDataSource } from 'src/config/data-source';
import { Order } from 'src/modules/operations/orders/entities/order.entity';
import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { ordersMock, createInstallationMocks } from './orders.mock';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';

export class OrdersSeeder {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    await appDataSource.transaction(async manager => {
      const allAddresses = await manager.find(Address, { relations: ['city'] });
      if (!allAddresses.length) throw new Error("No hay direcciones");

      const allRoles       = await manager.find(UserRole, { relations: ['role', 'user'] });
      const clientsPool    = allRoles.filter(ur => ur.role.name === 'Usuario');
      const coordsPool     = allRoles.filter(ur => ur.role.name === 'Coordinador');
      const installersList = await manager.find(Installer, { relations: ['user'] });

      if (!clientsPool.length || !coordsPool.length || !installersList.length) {
        throw new Error("Faltan clientes, coordinadores o instaladores");
      }

      // 1) Crear órdenes con múltiples clients
      const orders = ordersMock.map(data => {
        const selectedClients = [...clientsPool]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1); // 1-3
        return manager.create(Order, {
          ...data,
          client: selectedClients,
          progress: 0,
          installationsFinished: '0/0',
          completed: false,
          endDate: null,
          finishedAt: null,
        });
      });
      const savedOrders = await manager.save(orders);

      // 2) Crear instalaciones
      const installationsToInsert = savedOrders.flatMap(order => {
        const count = Math.floor(Math.random() * 10) + 1;
        const mocks = createInstallationMocks(order.title, count);

        // Determinar cuántas van terminadas
        const rnd = Math.random();
        let completedCount = 0, isDone = false;
        if (rnd < 0.33) {
          isDone = true; completedCount = count;
          order.completed = true; order.progress = 100;
        } else if (rnd < 0.66) {
          completedCount = count > 1
            ? Math.floor(Math.random() * (count - 1)) + 1
            : 0;
          order.completed = false;
          order.progress = +( (completedCount/count*100).toFixed(2) );
        } else {
          order.completed = false; order.progress = 0; completedCount = 0;
        }
        order.installationsFinished = `${completedCount}/${count}`;
        order.endDate     = (isDone||completedCount>0)? new Date(): null;
        order.finishedAt  = order.endDate;

        return mocks.map((mock, idx) => {
          // Estado y endDate sólo si aplica
          let status   = mock.status;
          let endDateD: Date | null = null;
          if (isDone || idx < completedCount) {
            status = InstallationStatus.FINISHED;
            endDateD = mock.endDate ?? new Date();
          }

          // Relaciones aleatorias
          const address     = allAddresses[Math.floor(Math.random()*allAddresses.length)];
          const coordinator = [...coordsPool]
            .sort(() => 0.5 - Math.random())
            .slice(0,1);
          const installers  = [...installersList]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random()*3)+1);

          // Construir objeto parcial
          const partial: Partial<Installation> = {
            ...mock as any,           // contiene notes, images
            status,
            startDate: new Date(mock.startDate),
            notes: mock.notes,
            images: mock.images,
            order,
            address,
            coordinator,
            installers,
            startedAt: new Date(mock.startDate),
            submittedForReviewAt: null,
          };
          if (endDateD) {
            partial.endDate = endDateD;
          }

          // TS infiere correctamente la firma create<T>(entity, DeepPartial<T>)
          return manager.create(Installation, partial as any);
        });
      });

      await manager.save(installationsToInsert);
      await manager.save(savedOrders);
      console.log('Seeding de Orders e Installations completo');
    });
  }
} */

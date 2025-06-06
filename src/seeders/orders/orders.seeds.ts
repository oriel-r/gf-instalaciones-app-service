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

    await appDataSource.transaction(async (manager) => {
      // 1. Recuperar todas las direcciones.
      const allAddresses = await manager.find(Address, { relations: ['city'] });
      if (!allAddresses.length) {
        throw new Error("No se encontraron direcciones en la base de datos");
      }

      // 2. Recuperar todos los UserRole (incluye role.name y user)
      const allRoles = await manager.find(UserRole, { relations: ['role', 'user'] });
      // Clientes = solo roles 'Usuario'
      const clients = allRoles.filter(ur => ur.role.name === 'Usuario');
      // Coordinadores = roles 'Coordinador'
      const coordinators = allRoles.filter(ur => ur.role.name === 'Coordinador');
      // Instaladores -> entidad Installer
      const installersList = await manager.find(Installer, { relations: ['user'] });

      if (!clients.length || !coordinators.length || !installersList.length) {
        throw new Error("Faltan usuarios (Clientes), coordinadores o instaladores sembrados");
      }

      // 3. Crear órdenes y asignar client aleatorio
      const orders = ordersMock.map(data => {
        const randomClient = clients[Math.floor(Math.random() * clients.length)];
        return manager.create(Order, {
          ...data,
          client: randomClient,
          progress: 0.00,
          installationsFinished: '0/0',
          completed: false,
          endDate: undefined,
        });
      });
      const savedOrders = await manager.save(orders);
      console.log('Orders created:', savedOrders.length);

      // 4. Generar instalaciones para cada orden, asignar coordinator e installers
      const installationsToInsert = savedOrders.flatMap(order => {
        const count = Math.floor(Math.random() * 10) + 1;
        const mocks = createInstallationMocks(order.title, count);

        // Decidir estado de la orden
        const stateRnd = Math.random();
        let completedCount = 0;
        let isOrderCompleted = false;

        if (stateRnd < 0.33) {
          isOrderCompleted = true;
          completedCount = count;
          order.completed = true;
          order.progress = 100;
        } else if (stateRnd < 0.66) {
          completedCount = count > 1
            ? Math.floor(Math.random() * (count - 1)) + 1
            : 0;
          order.completed = false;
          order.progress = Number(((completedCount / count) * 100).toFixed(2));
        } else {
          order.completed = false;
          order.progress = 0;
          completedCount = 0;
        }

        order.installationsFinished = `${completedCount}/${count}`;
        order.endDate = (isOrderCompleted || completedCount > 0) ? new Date() : null;

        return mocks.map((mock, idx) => {
          // Estado y endDate de la instalación
          let status = mock.status;
          let endDate: Date | undefined = mock.endDate;

          if (isOrderCompleted || idx < completedCount) {
            status = InstallationStatus.FINISHED;
            endDate = mock.endDate ?? new Date();
          } else {
            status = InstallationStatus.PENDING;
            endDate = undefined;
          }

          // Elegir dirección, coordinador e instaladores aleatorios
          const address     = allAddresses[Math.floor(Math.random() * allAddresses.length)];
          const coordinator = coordinators[Math.floor(Math.random() * coordinators.length)];
          const shuffled    = installersList.sort(() => 0.5 - Math.random());
          const installers  = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);

          return manager.create(Installation, {
            ...mock,
            status,
            startDate: mock.startDate,
            endDate,
            notes: mock.notes,
            images: mock.images,
            order,
            address,
            coordinator,
            installers,
          });
        });
      });

      const savedInstallations = await manager.save(installationsToInsert);
      console.log('Installations created:', savedInstallations.length);

      // 5. Re-guardar órdenes para aplicar client, progress, installationsFinished y endDate
      await manager.save(savedOrders);
    });
  }
} */

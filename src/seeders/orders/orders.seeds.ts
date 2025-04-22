import { appDataSource } from 'src/config/data-source';
import { Order } from 'src/modules/operations/orders/entities/order.entity';
import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { ordersMock, createInstallationMocks } from './orders.mock';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';

export class OrdersSeeder {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    await appDataSource.transaction(async (manager) => {
      // 1. Recuperar todas las direcciones existentes (se supone que ya fueron sembradas)
      const allAddresses = await manager.find(Address, { relations: ['city'] });
      if (allAddresses.length === 0) {
        throw new Error("No se encontraron direcciones en la base de datos");
      }
      
      // 2. Crear las órdenes utilizando los mocks
      const orders = ordersMock.map((orderData) =>
        manager.create(Order, { 
          ...orderData, 
          progress: 0.00, 
          installationsFinished: `0/0`, 
          completed: false,
          endDate: null,
        })
      );
      const savedOrders = await manager.save(orders);
      console.log('Orders created:', savedOrders.length);
      
      // 3. Para cada orden se generan entre 1 y 10 instalaciones y se determina su estado
      const installationsToInsert = savedOrders.flatMap((order) => {
        // Se genera un número aleatorio entre 1 y 10 instalaciones
        const count = Math.floor(Math.random() * 10) + 1;
        const installationMocks = createInstallationMocks(order.title, count);
        
        // Se decide el estado de la orden de forma aleatoria:
        // - < 0.33: Orden completada (todas las instalaciones terminadas)
        // - 0.33 a 0.66: Orden parcialmente completada (algunas terminadas)
        // - >= 0.66: Orden sin iniciar
        const orderState = Math.random();
        let completedCount = 0;
        if (orderState < 0.33) {
          // Orden completada: todas las instalaciones terminadas
          order.completed = true;
          order.progress = 100.00;
          completedCount = count;
        } else if (orderState < 0.66) {
          // Orden parcialmente completada: asegurar que haya al menos 1 terminada y menor al total.
          if (count > 1) {
            completedCount = Math.floor(Math.random() * (count - 1)) + 1;
          } else {
            completedCount = 0;
          }
          order.completed = false;
          order.progress = Number(((completedCount / count) * 100).toFixed(2));
        } else {
          // Orden sin iniciar
          order.completed = false;
          order.progress = 0.00;
          completedCount = 0;
        }
        // Actualizar el campo installationsFinished con el conteo correcto
        order.installationsFinished = `${completedCount}/${count}`;
        order.endDate = (order.completed || completedCount > 0) ? new Date() : null;
        
        // Generar instalaciones para la orden
        return installationMocks.map((installationData, idx) => {
          let installationStatus: InstallationStatus;
          let installationEndDate = installationData.endDate;
          
          if (order.completed) {
            // Para órdenes completadas: todas las instalaciones terminadas
            installationStatus = InstallationStatus.FINISHED;
            installationEndDate = installationData.endDate || new Date();
          } else if (!order.completed && completedCount > 0 && idx < completedCount) {
            // Para órdenes parcialmente completadas: las primeras "completedCount" se marcan como terminadas
            installationStatus = InstallationStatus.FINISHED;
            installationEndDate = installationData.endDate || new Date();
          } else {
            // El resto se marcan como pendientes
            installationStatus = InstallationStatus.PENDING;
            installationEndDate = undefined;
          }
          
          // Seleccionar una dirección aleatoria de entre todas disponibles
          const randomIndex = Math.floor(Math.random() * allAddresses.length);
          const randomAddress = allAddresses[randomIndex];
          
          const isFinished = installationStatus === InstallationStatus.FINISHED;
          
          return manager.create(Installation, {
            ...installationData,
            status: installationStatus,
            endDate: installationEndDate,
            order,
            address: randomAddress,
            coordinator: null,
            installers: null,
            notes: isFinished ? installationData.notes : undefined,
            images: isFinished ? installationData.images : [],
          });
        });
      });
      
      const savedInstallations = await manager.save(installationsToInsert);
      console.log('Installations created:', savedInstallations.length);
      
      // 4. Guardar nuevamente las órdenes para actualizar la información final
      await manager.save(savedOrders);
    });
  }
}

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
      // 1. Se recuperan todas las direcciones existentes (se supone que ya fueron sembradas)
      const allAddresses = await manager.find(Address, { relations: ['city'] });
      if (allAddresses.length === 0) {
        throw new Error("No se encontraron direcciones en la base de datos");
      }
      
      // 2. Se crean las órdenes utilizando los mocks
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
      
      // 3. Para cada orden se generan entre 1 y 4 instalaciones
      //    Y se determina aleatoriamente si la orden está completada, parcialmente completada o sin iniciar.
      const installationsToInsert = savedOrders.flatMap((order) => {
        const count = Math.floor(Math.random() * 10) + 1; // entre 1 y 4 instalaciones
        const installationMocks = createInstallationMocks(order.title, count);
        
        // Se decide el estado de la orden de forma aleatoria:
        // - < 0.33: completa (todas las instalaciones terminadas)
        // - 0.33 a 0.66: parcialmente completada (algunas terminadas)
        // - >= 0.66: sin iniciar
        const orderState = Math.random();
        let completedCount = 0;
        if (orderState < 0.33) {
          // Orden completada
          order.completed = true;
          order.progress = 100.00;
          order.installationsFinished = `${count}/${count}`;
          order.endDate = new Date();
          completedCount = count;
        } else if (orderState < 0.66) {
          // Orden parcialmente completada
          if (count > 1) {
            completedCount = Math.floor(Math.random() * (count - 1)) + 1; // al menos 1, pero menor al total
          } else {
            completedCount = 0;
          }
          order.completed = false;
          order.progress = Number(((completedCount / count) * 100).toFixed(2));
          order.installationsFinished = `${completedCount}/${count}`;
          order.endDate = completedCount > 0 ? new Date() : null;
        } else {
          // Orden sin iniciar
          order.completed = false;
          order.progress = 0.00;
          order.installationsFinished = `0/${count}`;
          order.endDate = null;
        }
        
        // Generación de las instalaciones para cada orden
        return installationMocks.map((installationData, idx) => {
          let installationStatus = installationData.status;
          let installationEndDate = installationData.endDate;
          
          if (order.completed) {
            // Para órdenes completadas, se fuerzan todas a FINISHED
            installationStatus = InstallationStatus.FINISHED;
            installationEndDate = installationData.endDate || new Date();
          } else if (!order.completed && completedCount > 0 && idx < completedCount) {
            // Para órdenes parciales, los primeros "completedCount" se marcan como FINISHED
            installationStatus = InstallationStatus.FINISHED;
            installationEndDate = installationData.endDate || new Date();
          }
          
          // Se selecciona una dirección aleatoria para la instalación
          const randomIndex = Math.floor(Math.random() * allAddresses.length);
          const randomAddress = allAddresses[randomIndex];
          
          return manager.create(Installation, {
            ...installationData,
            status: installationStatus,
            endDate: installationEndDate,
            order,
            address: randomAddress,
            coordinator: null,
            installers: null,
          });
        });
      });
      
      const savedInstallations = await manager.save(installationsToInsert);
      console.log('Installations created:', savedInstallations.length);
      
      // 4. Se guardan nuevamente las órdenes para actualizar su información
      await manager.save(savedOrders);
    });
  }
}
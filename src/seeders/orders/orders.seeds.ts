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
      // 1. Recuperar todas las direcciones disponibles (se asume que las ubicaciones ya fueron sembradas)
      const allAddresses = await manager.find(Address, { relations: ['city'] });
      if (allAddresses.length === 0) {
        throw new Error("No se encontraron direcciones en la base de datos");
      }
      
      // 2. Crear las órdenes usando los mocks
      const orders = ordersMock.map((orderData) =>
        manager.create(Order, { 
          ...orderData, 
          progress: 0.00, 
          installationsFinished: `0/${orderData.orderNumber}`, 
          completed: false,
          endDate: null,
        })
      );
      const savedOrders = await manager.save(orders);
      console.log('Orders created:', savedOrders.length);
      
      // 3. Para cada orden, generar un número aleatorio (entre 1 y 4) de instalaciones,
      //    y, dependiendo del índice, marcar la orden como completada.
      const installationsToInsert = savedOrders.flatMap((order, orderIndex) => {
        const count = Math.floor(Math.random() * 4) + 1; // Entre 1 y 4 instalaciones
        const installationMocks = createInstallationMocks(order.title, count);
        
        // Si el índice de la orden es par, la marcamos como completada.
        const isCompleted = orderIndex % 2 === 0;
        if (isCompleted) {
          order.completed = true;
          order.progress = 100.00;
          order.installationsFinished = `${count}/${count}`;
          // Se asigna una fecha de fin (por ejemplo, la fecha actual)
          order.endDate = new Date();
        } else {
          order.completed = false;
          order.progress = 0.00;
          order.installationsFinished = `0/${count}`;
          order.endDate = null;
        }
        
        // Generar instalaciones para la orden
        return installationMocks.map((installationData) => {
          // Se selecciona una dirección aleatoria de entre las existentes
          const randomIndex = Math.floor(Math.random() * allAddresses.length);
          const randomAddress = allAddresses[randomIndex];
          // Si la orden está completada, forzamos que el estado de la instalación sea FINISHED
          const installationStatus = isCompleted ? InstallationStatus.FINISHED : installationData.status;
          // Para órdenes completadas, si no se definió una fecha de fin en el mock, se establece la fecha actual
          const endDate = isCompleted ? (installationData.endDate || new Date()) : installationData.endDate;
          
          return manager.create(Installation, {
            ...installationData,
            status: installationStatus,
            endDate,
            order,
            address: randomAddress,
            // Se dejan en null campos opcionales (p.ej., coordinator e installers)
            coordinator: null,
            installers: null,
          });
        });
      });
      
      const savedInstallations = await manager.save(installationsToInsert);
      console.log('Installations created:', savedInstallations.length);
      
      // 4. Se guardan nuevamente los cambios en las órdenes (actualizando las que fueron marcadas como completadas)
      await manager.save(savedOrders);
    });
  }
}

import { appDataSource } from 'src/config/data-source';
import { Order } from 'src/modules/operations/orders/entities/order.entity';
import { Installation } from 'src/modules/operations/installations/entities/installation.entity';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { ordersMock, createInstallationMocks } from './orders.mock';

export class OrdersSeeder {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    await appDataSource.transaction(async (manager) => {

      const cabaAddress = await manager
        .createQueryBuilder(Address, 'address')
        .leftJoinAndSelect('address.city', 'city')
        .where('city.name = :cityName', { cityName: 'Ciudad 1 de CABA/GBA' })
        .getOne();

      if (!cabaAddress) {
        throw new Error('No se encontró una dirección en CABA');
      }

      const orders = ordersMock.map((orderData, index) =>
        manager.create(Order, { 
          ...orderData, 
          progress: 0.00, 
          installationsFinished: `0/${index + 1}`, 
          completed: false 
        })
      );
      const savedOrders = await manager.save(orders);
      console.log('Orders created:', savedOrders.length);

      // Crear instalaciones para cada orden:
      // la primera tendrá 1, la segunda 2, la tercera 3 y la cuarta 4 instalaciones
      const installationsToInsert = savedOrders.flatMap((order, index) => {
        const count = index + 1;
        const installationMocks = createInstallationMocks(order.title, count);
        return installationMocks.map((installationData) =>
          manager.create(Installation, {
            ...installationData,
            order,
            address: cabaAddress,
          })
        );
      });
      const savedInstallations = await manager.save(installationsToInsert);
      console.log('Installations created:', savedInstallations.length);
    });
  }
}

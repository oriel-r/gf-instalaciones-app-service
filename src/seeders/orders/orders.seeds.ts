import { appDataSource } from 'src/config/data-source';
import { Order } from 'src/modules/operations/orders/entities/order.entity';
import { Instalation } from 'src/modules/operations/instalations/entities/instalation.entity';
import { Adress } from 'src/modules/locations/adress/entities/adress.entity';
import { ordersMock, createInstallationMocks } from './orders.mock';

export class OrdersSeeder {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    await appDataSource.transaction(async (manager) => {
      // Obtener una dirección en CABA (por ejemplo, de la ciudad "Ciudad 1 de CABA")
      const cabaAddress = await manager
        .createQueryBuilder(Adress, 'adress')
        .leftJoinAndSelect('adress.city', 'city')
        .where('city.name = :cityName', { cityName: 'Ciudad 1 de CABA' })
        .getOne();

      if (!cabaAddress) {
        throw new Error('No se encontró una dirección en CABA');
      }

      // Crear las órdenes con progress 0.00, instalationsFinished "0/X" (X = número de instalaciones) y sin completarse
      const orders = ordersMock.map((orderData, index) =>
        manager.create(Order, { 
          ...orderData, 
          progress: 0.00, 
          instalationsFinished: `0/${index + 1}`, 
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
          manager.create(Instalation, {
            ...installationData,
            order,
            adress: cabaAddress,
          })
        );
      });
      const savedInstallations = await manager.save(installationsToInsert);
      console.log('Installations created:', savedInstallations.length);
    });
  }
}

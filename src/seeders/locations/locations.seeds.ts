import { Injectable } from '@nestjs/common';
import { appDataSource } from 'src/config/data-source';
import { Province } from 'src/modules/locations/province/entities/province.entity';
import { City } from 'src/modules/locations/city/entities/city.entity';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { provincesWithCitiesAndAddressesMock } from './locations.mock';

@Injectable()
export class LocationsSeeder {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) await appDataSource.initialize();

    await appDataSource.transaction(async (manager) => {
      // Si ya existen provincias, asumimos que todo está cargado
      if (await manager.count(Province)) {
        console.log('Locations already seeded');
        return;
      }

      // 1) Provincias
      const provinces = provincesWithCitiesAndAddressesMock.map((p) =>
        manager.create(Province, { name: p.name }),
      );
      const savedProvinces = await manager.save(provinces);
      console.log('Provinces created');

      // 2) Ciudades
      const cities: City[] = [];
      provincesWithCitiesAndAddressesMock.forEach((pMock, idx) => {
        const prov = savedProvinces[idx];
        pMock.cities.forEach((c) =>
          cities.push(manager.create(City, { name: c.name, province: prov })),
        );
      });
      const savedCities = await manager.save(cities);
      console.log('Cities created');

      // 3) Direcciones
      const addresses: Address[] = [];
      let cityIdx = 0;
      provincesWithCitiesAndAddressesMock.forEach((p) =>
        p.cities.forEach((c) => {
          const city = savedCities[cityIdx++];
          c.addresses.forEach((a) =>
            addresses.push(manager.create(Address, { ...a, city })),
          );
        }),
      );
      await manager.save(addresses);
      console.log('Addresses created');
    });
  }
}

import { appDataSource } from 'src/config/data-source';
import { Province } from 'src/modules/locations/province/entities/province.entity';
import { City } from 'src/modules/locations/city/entities/city.entity';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { provincesMock, createCitiesMock, createAddressMock } from './locations.mock';

export class LocationsSeeder {
  async seed(): Promise<void> {

    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    await appDataSource.transaction(async (manager) => {
      try {
        const provinces = provincesMock.map((provinceData) =>
          manager.create(Province, provinceData)
        );
        
        const savedProvinces = await manager.save(provinces);
        if (savedProvinces) console.log('Provinces are created');

        const citiesToInsert = savedProvinces.flatMap((province) =>
          createCitiesMock(province.name).map((cityData) =>
            manager.create(City, { ...cityData, province: province })
          )
        );
        const savedCities = await manager.save(citiesToInsert);
        if (savedCities) console.log('Cities are created');

        const addressesToInsert = savedCities.flatMap((city) =>
          createAddressMock(city.name).map((addressData) =>
            manager.create(Address, { ...addressData, city })
          )
        );
        const savedAddress = await manager.save(addressesToInsert);
        if (savedAddress) console.log('Address created');
      } catch (error) {
        console.log(error);
      }
    });
  }
}

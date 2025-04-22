import { appDataSource } from 'src/config/data-source';
import { Province } from 'src/modules/locations/province/entities/province.entity';
import { City } from 'src/modules/locations/city/entities/city.entity';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { provincesWithCitiesAndAddressesMock } from './locations.mock';

export class LocationsSeeder {
  async seed(): Promise<void> {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    await appDataSource.transaction(async (manager) => {
      try {
        // 1. Crear provincias (sin ciudades ni direcciones aún)
        const provincesData = provincesWithCitiesAndAddressesMock.map((provinceMock) =>
          manager.create(Province, { name: provinceMock.name })
        );
        const savedProvinces = await manager.save(provincesData);
        if (savedProvinces) {
          console.log('Provinces created');
        }

        // 2. Crear ciudades para cada provincia
        let citiesToInsert: City[] = [];
        // Recorremos el mock y utilizamos el índice para relacionar con la provincia guardada
        provincesWithCitiesAndAddressesMock.forEach((provinceMock, index) => {
          const province = savedProvinces[index];
          const cities = provinceMock.cities.map((cityMock) =>
            manager.create(City, { name: cityMock.name, province })
          );
          citiesToInsert = citiesToInsert.concat(cities);
        });
        const savedCities = await manager.save(citiesToInsert);
        if (savedCities) {
          console.log('Cities created');
        }

        // 3. Crear direcciones para cada ciudad.
        // Debido a que guardamos las ciudades de forma lineal, mantenemos un contador para ir correlacionándolas
        let addressesToInsert: Address[] = [];
        let cityCounter = 0;
        provincesWithCitiesAndAddressesMock.forEach((provinceMock) => {
          provinceMock.cities.forEach((cityMock) => {
            // Se toma la ciudad guardada correspondiente
            const city = savedCities[cityCounter];
            cityCounter++;
            // Se crean las direcciones según el mock
            const addresses = cityMock.addresses.map((addressMock) =>
              manager.create(Address, { ...addressMock, city })
            );
            addressesToInsert = addressesToInsert.concat(addresses);
          });
        });
        const savedAddresses = await manager.save(addressesToInsert);
        if (savedAddresses) {
          console.log('Addresses created');
        }
      } catch (error) {
        console.error('Error seeding locations:', error);
      }
    });
  }
}

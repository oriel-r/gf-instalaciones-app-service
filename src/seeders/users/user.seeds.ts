import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { hash } from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/entities/roles.entity';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { TaxCategory } from 'src/common/enums/taxCategory.enum';

@Injectable()
export class UserSeeds {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    @InjectRepository(Installer)
    private readonly installerRepository: Repository<Installer>,
  ) {}

  async seed() {
    // Verificar si ya existen usuarios
    const userCount = await this.usersRepository.count();
    if (userCount > 0) {
      console.log('Users already seeded!');
      return;
    }

    // Crear roles si no existen
    const adminRole = await this.rolesRepository.save({ name: 'Admin' });
    const coordinadorRole = await this.rolesRepository.save({
      name: 'Coordinador',
    });
    const instaladorRole = await this.rolesRepository.save({
      name: 'Instalador',
    });
    const userRole = await this.rolesRepository.save({ name: 'Usuario' });

    // Usuarios a insertar
    const usersData = [
      {
        fullName: 'User 1',
        email: 'admin1@example.com',
        password: 'Admin1231@',
        idNumber: '1234561',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234561',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Admin',
      },
      {
        fullName: 'User 2',
        email: 'user2@example.com',
        password: 'User12312@',
        idNumber: '1234562',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234562',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 3',
        email: 'user3@example.com',
        password: 'User12313@',
        idNumber: '1234563',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234563',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 4',
        email: 'user4@example.com',
        password: 'User1234@',
        idNumber: '1234564',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234564',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 5',
        email: 'user5@example.com',
        password: 'User1235@',
        idNumber: '1234565',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234565',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 6',
        email: 'user6@example.com',
        password: 'User1236@',
        idNumber: '1234566',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234566',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 7',
        email: 'user7@example.com',
        password: 'User1237@',
        idNumber: '1234567',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234567',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 8',
        email: 'user8@example.com',
        password: 'User1238@',
        idNumber: '1234568',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234568',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 9',
        email: 'user9@example.com',
        password: 'User1239@',
        idNumber: '1234569',
        location: 'example',
        address: 'exampleAdress',
        phone: '1234569',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 10',
        email: 'user10@example.com',
        password: 'User12310@',
        idNumber: '12345610',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345610',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 11',
        email: 'user11@example.com',
        password: 'User12311@',
        idNumber: '12345611',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345611',
        country: 'Argentina',
        birthDate: '1999-08-03',
        role: 'Usuario',
      },
      {
        fullName: 'User 12',
        email: 'user12@example.com',
        password: 'User12312@',
        idNumber: '67891012',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345712',
        country: 'Peru',
        birthDate: '2001-01-04',
        role: 'Usuario',
      },
      {
        fullName: 'User 13',
        email: 'user13@example.com',
        password: 'User23413@',
        idNumber: '65463413',
        location: 'example',
        address: 'exampleAdress',
        country: 'Argentina',
        phone: '12345813',
        birthDate: '2003-06-05',
        role: 'Coordinador',
      },
      {
        fullName: 'User 14',
        email: 'user14@example.com',
        password: 'User12314@',
        idNumber: '67891014',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345714',
        country: 'Peru',
        birthDate: '2001-01-04',
        role: 'Usuario',
      },
      {
        fullName: 'User 15',
        email: 'user15@example.com',
        password: 'User12315@',
        idNumber: '67891015',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345715',
        country: 'Peru',
        birthDate: '2001-01-04',
        role: 'Usuario',
      },
      {
        fullName: 'User 16',
        email: 'user16@example.com',
        password: 'User12316@',
        idNumber: '67891016',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345716',
        country: 'Peru',
        birthDate: '2001-01-04',
        role: 'Usuario',
      },
      {
        fullName: 'User 17',
        email: 'user17@example.com',
        password: 'User12317@',
        idNumber: '678910',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345717',
        country: 'Peru',
        birthDate: '2001-01-04',
        role: 'Usuario',
      },
      {
        fullName: 'User 18',
        email: 'user18@example.com',
        password: 'User12318@',
        idNumber: '67891018',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345718',
        country: 'Peru',
        birthDate: '2001-01-04',
        role: 'Instalador',
        taxCondition: TaxCategory.Monotributist,
        hasPersonalAccidentInsurance: true,
        canWorkAtHeight: true,
        canTensionFrontAndBackLonas: true,
        canInstallCorporealSigns: true,
        canInstallFrostedVinyl: true,
        canInstallVinylOnWallsOrGlass: true,
        canDoCarWrapping: true,
        hasOwnTransportation: true,
      },
      {
        fullName: 'User 19',
        email: 'user19@example.com',
        password: 'User12319@',
        idNumber: '67891019',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345719',
        country: 'Peru',
        birthDate: '2001-01-04',
        role: 'Instalador',
        taxCondition: TaxCategory.Monotributist,
        hasPersonalAccidentInsurance: true,
        canWorkAtHeight: true,
        canTensionFrontAndBackLonas: true,
        canInstallCorporealSigns: true,
        canInstallFrostedVinyl: true,
        canInstallVinylOnWallsOrGlass: true,
        canDoCarWrapping: true,
        hasOwnTransportation: true,
      },
      {
        fullName: 'User 20',
        email: 'user20@example.com',
        password: 'User120@',
        idNumber: '67891020',
        location: 'example',
        address: 'exampleAdress',
        phone: '12345720',
        country: 'Peru',
        birthDate: '2001-01-04',
        role: 'Instalador',
        taxCondition: TaxCategory.Monotributist,
        hasPersonalAccidentInsurance: true,
        canWorkAtHeight: true,
        canTensionFrontAndBackLonas: true,
        canInstallCorporealSigns: true,
        canInstallFrostedVinyl: true,
        canInstallVinylOnWallsOrGlass: true,
        canDoCarWrapping: true,
        hasOwnTransportation: true,
      },
    ];

    for (const userData of usersData) {
      const { role, ...rest } = userData;

      // Asignar el rol correspondiente
      let roleUsers: Role;
      switch (role) {
        case 'Admin':
          roleUsers = adminRole;
          break;
        case 'Coordinador':
          roleUsers = coordinadorRole;
          break;
        case 'Instalador':
          roleUsers = instaladorRole;
          break;
        default:
          roleUsers = userRole;
      }

      // Hashear la contraseña
      const hashedPassword = await hash(userData.password, 10);

      // Crear usuario con los datos correspondientes
      const user = this.usersRepository.create({
        ...rest, // Otros campos como phone, address, etc.
        email: userData.email,
        password: hashedPassword,
        role: roleUsers,
      });

      // Guardar el usuario
      await this.usersRepository.save(user);

      if ( role === 'Instalador') {
        const installer = this.installerRepository.create({
          taxCondition: userData.taxCondition,
          hasPersonalAccidentInsurance: userData.hasPersonalAccidentInsurance,
          canWorkAtHeight: userData.canWorkAtHeight,
          canTensionFrontAndBackLonas: userData.canTensionFrontAndBackLonas,
          canInstallCorporealSigns: userData.canInstallCorporealSigns,
          canInstallFrostedVinyl: userData.canInstallFrostedVinyl,
          canInstallVinylOnWallsOrGlass: userData.canInstallVinylOnWallsOrGlass,
          canDoCarWrapping: userData.canDoCarWrapping,
          hasOwnTransportation: userData.hasOwnTransportation,
          user: user, //
        });
        await this.installerRepository.save(installer);
      }
    }

    console.log('Users and installers seeded successfully');
  }
}

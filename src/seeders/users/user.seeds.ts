import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/entities/roles.entity';

@Injectable()
export class UserSeeds {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async seed() {
    // Verificar si ya existen roles
    const existingRoles = await this.rolesRepository.find();
    
    if (existingRoles.length === 0) {
      const rolesData = ['Admin', 'Instalador', 'Coordinador', 'Usuario'].map(name =>
        this.rolesRepository.create({ name })
      );
      await this.rolesRepository.save(rolesData);
    }

    // Obtener los roles ya creados
    const roles = await this.rolesRepository.find();

    // Usuarios a insertar
    const users = [
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
          roleName: 'Admin',
        },
        {
          fullName: 'User 2',
          email: 'user2@example.com',
          password: 'User12311@',
          idNumber: '1234562',
          location: 'example',
          address: 'exampleAdress',
          phone: '1234562',
          country: 'Argentina',
          birthDate: '1999-08-03',
          roleName: 'Usuario',
        },
        {
          fullName: 'User 3',
          email: 'user3@example.com',
          password: 'User12311@',
          idNumber: '1234563',
          location: 'example',
          address: 'exampleAdress',
          phone: '1234563',
          country: 'Argentina',
          birthDate: '1999-08-03',
          roleName: 'Usuario',
        },
        {
          fullName: 'User 4',
          email: 'user11@example.com',
          password: 'User1234@',
          idNumber: '1234564',
          location: 'example',
          address: 'exampleAdress',
          phone: '1234564',
          country: 'Argentina',
          birthDate: '1999-08-03',
          roleName: 'Usuario',
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
          roleName: 'Usuario',
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
          roleName: 'Usuario',
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
          roleName: 'Usuario',
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
          roleName: 'Usuario',
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
          roleName: 'Usuario',
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
          roleName: 'Usuario',
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
          roleName: 'Usuario',
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
          roleName: 'Instalador',
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
          roleName: 'Coordinador',
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
          roleName: 'Instalador',
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
          roleName: 'Instalador',
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
          roleName: 'Instalador',
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
          roleName: 'Instalador',
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
          roleName: 'Instalador',
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
          roleName: 'Instalador',
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
          roleName: 'Instalador',
        }
    ];

    try {
      for (const userData of users) {
        const { email, password, roleName, ...rest } = userData;

        const existingUser = await this.usersRepository.findOne({ where: { email } });

        if (!existingUser) {
          // Hashear la contraseña
          const hashedPassword = await bcrypt.hash(password, 10);

          // Obtener el rol correspondiente
          const userRole = roles.find(role => role.name === roleName);

          if (!userRole) {
            throw new Error(`Rol ${roleName} no encontrado`);
          }

          // Crear usuario
          const user = this.usersRepository.create({
            ...rest,
            email,
            password: hashedPassword,
            role: userRole, // Relacionar con el rol correspondiente
          });

          // Guardar usuario
          await this.usersRepository.save(user);
        }
      }

      console.log('Usuarios precargados correctamente.');
    } catch (error) {
      console.error('Error en la precarga de usuarios:', error);
    }
  }
}

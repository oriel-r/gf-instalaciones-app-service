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
      const rolesData = ['Admin', 'Instalador', 'Coordinador'].map(name =>
        this.rolesRepository.create({ name })
      );
      await this.rolesRepository.save(rolesData);
    }

    // Obtener los roles ya creados
    const roles = await this.rolesRepository.find();

    // Usuarios a insertar
    const users = [
      {
        fullName: 'Jane Smith',
        email: 'admin@example.com',
        password: 'Admin123@',
        idNumber: '123456',
        location: 'example',
        address: 'exampleAdress',
        phone: '123456',
        country: 'Argentina',
        birthDate: '1999-08-03',
        roleName: 'Admin',
      },
      {
        fullName: 'Jhon Doe',
        email: 'user1@example.com',
        password: 'User123@',
        idNumber: '678910',
        location: 'example',
        address: 'exampleAdress',
        phone: '123457',
        country: 'Peru',
        birthDate: '2001-01-04',
        roleName: 'Instalador',
      },
      {
        fullName: 'Joe Doe',
        email: 'user2@example.com',
        password: 'User234@',
        idNumber: '654634',
        location: 'example',
        address: 'exampleAdress',
        country: 'Argentina',
        phone: '123458',
        birthDate: '2003-06-05',
        roleName: 'Coordinador',
      },
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

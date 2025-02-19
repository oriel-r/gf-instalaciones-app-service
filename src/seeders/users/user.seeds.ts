import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class UserSeeds {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async seed() {
    const users = [
      {
        name: 'Jane',
        surname: 'Smith',
        email: 'admin@example.com',
        password: 'Admin123@',
        confirmPassword: 'Admin123@',
        identificationNumber: '123456',
        location: 'example',
        adress: 'exampleAdress',
        phone: '123456',
        birthdate: '03/08/1999',
      },
      {
        name: 'Jhon',
        surname: 'Doe',
        email: 'user1@example.com',
        password: 'User123@',
        confirmPassword: 'User123@',
        identificationNumber: '678910',
        location: 'example',
        adress: 'exampleAdress',
        phone: '123457',
        birthdate: '04/01/2001',
      },
      {
        name: 'Joe',
        surname: 'Martinez',
        email: 'user2@example.com',
        password: 'User234@',
        confirmPassword: 'User234@',
        identificationNumber: 'User234@',
        idNumber: '654634',
        location: 'example',
        adress: 'exampleAdress',
        phone: '123458',
        birthdate: '05/06/2003',
      },
    ];

    try {
      for (const userData of users) {
        const { email, password, ...rest } = userData;

        const existingUser = await this.usersRepository.findOne({
          where: { email },
        });

        if (!existingUser) {

          //Hashear la contraseña
          const hashedPassword = await bcrypt.hash(password, 10);

          //Crear nuevo usuario
          const user = this.usersRepository.create({
            ...rest,
            email,
            password: hashedPassword,
          });

          //Guardar usuario en la base de datos
          await this.usersRepository.save(user);
        }
      }

      console.log('Preload exitoso!');
      
    } catch (error) {
        console.error('Error en la precarga de usuarios:' , error);
    }
  }
}
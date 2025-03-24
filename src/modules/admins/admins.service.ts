import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../user/entities/roles.entity';
import { Admin } from './entities/admins.entity';

@ApiTags('Admin')
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findAll() {
    return await this.adminRepository.find();
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin)
      throw new HttpException('Admin no encontrado', HttpStatus.NOT_FOUND);
    return admin;
  }

 /*  async removeAdminRole(adminId: string) {
    const user = await this.userRepository.findOne({
      where: { id: adminId },
      relations: ['admin'],
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const role = await this.roleRepository.findOne({
      where: { name: 'Usuario' },
    });
    if (!role) {
      throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
    }

    user.userRoles = role;

    if (user.admin) {

      const admin = await this.findOne(user.admin.id);

      if (admin) {
        user.admin = undefined;
        await this.userRepository.save(user);
        await this.adminRepository.remove(admin);
      }
    }

    await this.userRepository.save(user);
    console.log('Usuario actualizado:', user);
    return user;
  } */
}

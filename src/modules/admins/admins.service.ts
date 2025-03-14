import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
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
    private readonly userService: UserService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async assignAdmin(adminId: string) {
    const user = await this.userRepository.findOne({
      where: { id: adminId },
      relations: ['admin'],
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const role = await this.roleRepository.findOne({
      where: { name: 'Admin' },
    });
    if (!role) {
      throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
    }

    user.role = role;

    if (!user.admin) {
      const newAdmin = this.adminRepository.create({ user });
      user.admin = await this.adminRepository.save(newAdmin);
    }

    await this.userRepository.save(user);
    console.log('Usuario actualizado:', user);
    return user;
  }

  async findAll() {
    return await this.adminRepository.find();
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin)
      throw new HttpException('Admin no encontrado', HttpStatus.NOT_FOUND);
    return admin;
  }

  async removeAdminRole(adminId: string) {
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

    user.role = role;

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
  }
}

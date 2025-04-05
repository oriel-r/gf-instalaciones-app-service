import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../user/entities/roles.entity';
import { Admin } from './entities/admins.entity';
import { UserRole } from '../user-role/entities/user-role.entity';

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
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
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

  async removeAdminRole(adminId: string) {
    const user = await this.userRepository.findOne({
        where: { id: adminId },
        relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const adminRole = user.userRoles.find(ur => ur.role.name === 'Admin');

    if (!adminRole) {
        throw new HttpException('El usuario no tiene rol de administrador', HttpStatus.BAD_REQUEST);
    }

    const userRole = await this.roleRepository.findOne({
        where: { name: 'Usuario' },
    });

    if (!userRole) {
        throw new HttpException('Rol de usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    await this.userRoleRepository.delete({ user: { id: adminId }, role: { id: adminRole.role.id } });

    const newUserRole = this.userRoleRepository.create({
        user,
        role: userRole,
    });

    await this.userRoleRepository.save(newUserRole);

    console.log('Usuario actualizado:', user);
    return user;
} 
}

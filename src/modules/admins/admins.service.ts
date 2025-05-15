import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Role } from '../user/entities/roles.entity';
import { Admin } from './entities/admins.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { UserService } from '../user/user.service';

@ApiTags('Admin')
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async createAdminTransactional(userId: string, queryRunner: QueryRunner): Promise<Admin> {
    const user = await queryRunner.manager.findOne(User, {
      where: { id: userId },
      relations: ['admin'],
    });
  
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.admin) throw new ConflictException('Ya es admin');
  
    const newAdmin = queryRunner.manager.create(Admin, { user });
    return await queryRunner.manager.save(Admin, newAdmin);
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
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const adminRole = user.userRoles.find((ur) => ur.role.name === 'Admin');

    if (!adminRole) {
      throw new HttpException(
        'El usuario no tiene rol de administrador',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRole = await this.roleRepository.findOne({
      where: { name: 'Usuario' },
    });

    if (!userRole) {
      throw new HttpException(
        'Rol de usuario no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userRoleRepository.delete({
      user: { id: adminId },
      role: { id: adminRole.role.id },
    });

    const newUserRole = this.userRoleRepository.create({
      user,
      role: userRole,
    });

    await this.userRoleRepository.save(newUserRole);

    console.log('Usuario actualizado:', user);
    return user;
  }

  async deleteAdmin(userId: string) {
    const admin = await this.adminRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    
    if (!admin) {
      throw new HttpException('Entidad Admin no encontrada', HttpStatus.NOT_FOUND);
    }
    
    await this.adminRepository.remove(admin);
    
    return { message: 'Rol de administrador eliminado correctamente' };
  }

  async disable(id: string) {
      const admin = await this.findOne(id);
      if (admin.disabledAt) {
        throw new BadRequestException('Este admin ya está deshabilitado');
      }
    
      admin.disabledAt = new Date();
      await this.adminRepository.save(admin);
      return { message: 'admin desactivado correctamente' };
  }

  async restore(id: string) {
    const admin = await this.findOne(id);
    if (!admin.disabledAt) {
      throw new BadRequestException('Este admin ya está activo');
    }
  
    admin.disabledAt = null;
    await this.adminRepository.save(admin);
    return { message: 'admin restaurado correctamente' };
  } 
}

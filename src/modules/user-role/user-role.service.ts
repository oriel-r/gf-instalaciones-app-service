import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../user-role/entities/user-role.entity';
import { Repository } from 'typeorm';
import { Role } from '../user/entities/roles.entity';
import { UserService } from '../user/user.service';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { AdminService } from '../admins/admins.service';
import { CoordinatorsService } from '../coordinators/coordinators.service';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly coordinatorService: CoordinatorsService,
  ) {}

  async assignRole(userId: string, roleId: string): Promise<UserRole> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const existingRole = await this.userRoleRepository.findOne({
      where: { user: { id: userId }, role: { id: roleId } },
    });

    if (existingRole) {
      throw new ConflictException('El usuario ya tiene este rol asignado');
    }

    const userRole = this.userRoleRepository.create({ user, role });
    const savedRole = await this.userRoleRepository.save(userRole);

    if (role.name === 'Coordinador' && !user.coordinator) {
      await this.coordinatorService.createCoordinator(user.id);
    }

    if (role.name === 'Admin' && !user.admin) {
      await this.adminService.createAdmin(user.id);
    }

    return savedRole;
  }

  async findUserRoleById(userId: string) {
    return await this.userRoleRepository.findOne({
      where: { user: { id: userId } },
      relations: ['role'],
    });
  }

  async getByIdWhenRole(id: string, roleName: RoleEnum) {
    const role = await this.userRoleRepository.findOne({
      where: { id: id, role: { name: roleName } },
      relations: { role: true },
    });

    return role;
  }

  async removeRole(
    userId: string,
    roleId: string,
  ): Promise<{ message: string }> {
    const existingRole = await this.userRoleRepository.findOne({
      where: {
        user: { id: userId },
        role: { id: roleId },
      },
      relations: ['user', 'role'],
    });

    if (!existingRole) {
      throw new NotFoundException('Este rol no está asignado al usuario');
    }

    await this.userRoleRepository.remove(existingRole);

    return { message: 'Rol removido del usuario correctamente' };
  }
}

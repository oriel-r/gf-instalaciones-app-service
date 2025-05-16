import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../user-role/entities/user-role.entity';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../user/entities/roles.entity';
import { UserService } from '../user/user.service';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { AdminService } from '../admins/admins.service';
import { CoordinatorsService } from '../coordinators/coordinators.service';
import { User } from '../user/entities/user.entity';

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
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.userRoleRepository.find()
  }

  async assignRole(userId: string, roleId: string): Promise<UserRole> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      const role = await queryRunner.manager.findOne(Role, {
        where: { id: roleId },
      });
      if (!role) throw new NotFoundException('Rol no encontrado');

      const existingRole = await queryRunner.manager.findOne(UserRole, {
        where: { user: { id: userId }, role: { id: roleId } },
      });
      if (existingRole)
        throw new ConflictException('El usuario ya tiene este rol asignado');

      const userRole = queryRunner.manager.create(UserRole, { user, role });
      const savedRole = await queryRunner.manager.save(userRole);

      if (role.name === RoleEnum.COORDINATOR) {
        await this.coordinatorService.createCoordinatorTransactional(
          user.id,
          queryRunner,
        );
      }

      if (role.name === RoleEnum.ADMIN) {
        await this.adminService.createAdminTransactional(user.id, queryRunner);
      }

      await queryRunner.commitTransaction();
      return savedRole;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserRoleById(userId: string) {
    return await this.userRoleRepository.findOne({
      where: { user: { id: userId } },
      relations: ['role'],
    });
  }

  async findRolesById(userId: string) {
    return await this.userRoleRepository.find({
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

  async getByUserIdAndRole(userId: string, roleId: string) {
    return await this.userRoleRepository.findOne({
      where: {
        user: { id: userId },
        role: { id: roleId },
      },
      relations: ['user', 'role'],
    });
  }

  async removeRole(
    userId: string,
    roleId: string,
  ): Promise<{ message: string }> {
    const existingRole = await this.getByUserIdAndRole(userId, roleId);

    if (!existingRole) {
      throw new NotFoundException('Este rol no está asignado al usuario');
    }

    await this.userRoleRepository.remove(existingRole);
    await this.userService.deleteUserByRole(userId, roleId);

    return { message: 'Rol removido del usuario correctamente' };
  }

  async disabledUserRole(userId: string) {
    const userRoles = await this.userRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'role'],
    });

    if (!userRoles.length) {
      throw new NotFoundException('No se encontraron roles para este usuario');
    }

    for (const userRole of userRoles) {
      userRole.isActive = false;
    }

    await this.userRoleRepository.save(userRoles);
  }

  async restoreUserRoles(userId: string) {
  const userRoles = await this.userRoleRepository.find({
    where: { user: { id: userId } },
    relations: ['user', 'role'],
  });

  if (!userRoles.length) {
    throw new NotFoundException('No se encontraron roles para este usuario');
  }

  for (const userRole of userRoles) {
    userRole.isActive = true;
  }

  await this.userRoleRepository.save(userRoles);
}

}

import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IsNull, Not, Repository } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { UserRoleService } from '../user-role/user-role.service';
import { Role } from './entities/roles.entity';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { UserQueryOptions } from './dto/users-filter.dto';
import { UserWithRolesDto } from './dto/user-with-roles.dto';
import { InstallerService } from '../installer/installer.service';
import { CoordinatorsService } from '../coordinators/coordinators.service';
import { Order } from '../operations/orders/entities/order.entity';
import { AdminService } from '../admins/admins.service';
import { UserRole } from '../user-role/entities/user-role.entity';
import { plainToInstance } from 'class-transformer';
import { UserSummaryDto } from './dto/user-summary.dto';

@ApiTags('Users')
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @Inject(forwardRef(() => UserRoleService))
    private readonly userRoleService: UserRoleService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly installerService: InstallerService,
    private readonly coordinatorService: CoordinatorsService,
    private readonly adminService: AdminService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserWithRolesDto> {
    const { email, idNumber, phone, password } = createUserDto;

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const existingIdNumber = await this.userRepository.findOne({
      where: { idNumber },
    });
    if (existingIdNumber) {
      throw new ConflictException(
        'El documento de identidad ya está registrado',
      );
    }

    const existingPhone = await this.userRepository.findOne({
      where: { phone },
    });
    if (existingPhone) {
      throw new ConflictException(
        'El número de celular ya se encuentra registrado',
      );
    }

    const userDisabled = await this.userByEmailByDisabled(email);
    if (userDisabled.disabledAt) {
      throw new ConflictException('El correo electrónico está deshabilitado');
    }

    const hashedPassword = await hash(password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    let role = await this.roleRepository.findOneBy({ name: RoleEnum.USER });

    if (!role) {
      role = this.roleRepository.create({ name: RoleEnum.USER });
      role = await this.roleRepository.save(role);
    }

    await this.userRoleService.assignRole(newUser.id, role.id);

    const fullUser = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: [
        'userRoles',
        'userRoles.role',
        'installer',
        'coordinator',
        'admin',
      ],
    });

    if (!fullUser) {
      throw new InternalServerErrorException(
        'Error al cargar el usuario completo',
      );
    }

    return plainToInstance(UserWithRolesDto, fullUser, { excludeExtraneousValues: true });
  }

  async userByEmailByDisabled(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.email = :email', { email })
      .andWhere('user.disabledAt IS NOT NULL')
      .getOne();

      return plainToInstance(UserWithRolesDto, user, { excludeExtraneousValues: true });
  }
  
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: [
        'userRoles',
        'userRoles.role',
        'installer',
        'coordinator',
        'admin',
      ],
      order: {
        createdAt: 'ASC', // si querés ordenar (no podés por relaciones, pero sí por columnas propias)
      },
    });
  
    return users
  }  

  async findAllRoles() {
    return await this.roleRepository.find();
  }

  async findFilterSort(queryOptions: UserQueryOptions) {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    queryBuilder
    .leftJoinAndSelect('users.userRoles', 'userRole' )
    .leftJoinAndSelect('userRole.role', 'role')
    .leftJoinAndSelect(Order, 'orders', 'orders.client = userRole.id')

    queryBuilder.where('role.name = :name', {name: queryOptions.role})

    queryBuilder
      .orderBy('users.createdAt', 'DESC')
      .skip((queryOptions.page - 1) * queryOptions.limit)
      .take(queryOptions.limit);

    const findResult: PaginationResult<User> =
      await queryBuilder.getManyAndCount();

    return findResult;
  }

  async findByEmail(email: string): Promise<UserWithRolesDto> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: [
        'userRoles',
        'userRoles.role',
        'installer',
        'coordinator',
        'admin',
      ],
    });
  
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    return plainToInstance(UserSummaryDto, user, { excludeExtraneousValues: true });
  }  

  async findById(id: string): Promise<UserWithRolesDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'userRoles',
        'userRoles.role',
        'installer',
        'coordinator',
        'admin',
      ],
    });
  
    if (!user) throw new NotFoundException('Usuario no encontrado');
  
    return plainToInstance(UserWithRolesDto, user, {
      excludeExtraneousValues: true,
    });
  }  

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    Object.assign(user, updateUserDto);

    const updateUser = await this.userRepository.save(user);

    return plainToInstance(UserSummaryDto, updateUser, { excludeExtraneousValues: true });
  }

  async deleteUserByRole(userId: string, roleId: string): Promise<{ message: string }> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
  
    const deleteMap: Record<RoleEnum, (userId: string) => Promise<void>> = {
      Admin: this.adminService.deleteAdmin.bind(this.adminService),
      Coordinador: this.coordinatorService.delete.bind(this.coordinatorService),
      Instalador: this.installerService.delete.bind(this.installerService),
      Usuario: async () => {},
      Cliente: async () => {},
    };
  
    const deleteFn = deleteMap[role.name as RoleEnum];
    if (deleteFn) {
      await deleteFn(userId);
    }
  
    return { message: 'Rol eliminado correctamente' };
  }
   
  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({where: {id: userId}});

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
  
    const roles = await this.userRoleService.findRolesById(userId);
  
    const deleteMap: Record<RoleEnum, (userId: string) => Promise<void>> = {
      [RoleEnum.COORDINATOR]: this.coordinatorService.delete.bind(this.coordinatorService),
      [RoleEnum.ADMIN]: this.adminService.deleteAdmin.bind(this.adminService),
      [RoleEnum.INSTALLER]: this.installerService.delete.bind(this.installerService),
      [RoleEnum.USER]: async () => {},
      [RoleEnum.CUSTOMER]: async () => {},
    };
  
    for (const role of roles) {
      const roleName = role.role.name as RoleEnum;
      const deleteFn = deleteMap[roleName];
  
      if (deleteFn) {
        await deleteFn(userId);
      }
  
      await this.userRoleRepository.delete({
        user: { id: userId },
        role: { id: role.role.id },
      });
    }
  
    await this.userRepository.remove(user);
  
    return { message: 'Usuario y sus roles eliminados correctamente' };
  }  
  
  async disableUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['installer', 'coordinator', 'admin'],
    });
  
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    if (user.disabledAt) {
      throw new BadRequestException('El usuario ya está deshabilitado');
    }
  
    user.disabledAt = new Date();
    await this.userRepository.save(user);
  
    if (user.installer) {
      await this.installerService.disable(user.installer.id);
    }
  
    if (user.coordinator) {
      await this.coordinatorService.disable(user.coordinator.id);
    }

    if (user.admin) {
      await this.adminService.disable(user.admin.id);
    }

    await this.userRoleService.disabledUserRole(user.id);

    return { message: 'Usuario desactivado correctamente' };
  }
  
  async restoreUser(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['installer', 'coordinator'],
      withDeleted: true,
    });
  
    if (!user || !user.disabledAt) {
      throw new BadRequestException('El usuario ya está activo');
    }
  
    user.disabledAt = null;
    await this.userRepository.save(user);
  
    if (user.installer?.disabledAt) {
      await this.installerService.restore(user.installer.id);
    }
  
    if (user.coordinator?.disabledAt) {
      await this.coordinatorService.restore(user.coordinator.id);
    }

    if (user.admin?.disabledAt) {
      await this.adminService.restore(user.admin.id);
    }
  
    await this.userRoleService.restoreUserRoles(user.id);

    return { message: 'Usuario restaurado correctamente' };
  }

  async findByIdNumber(idNumber: string) {
    const user = await this.userRepository.findOne({
      where: { idNumber },
    });

    return plainToInstance(UserSummaryDto, user, { excludeExtraneousValues: true });
  }
}

import {
  BadRequestException,
  ConflictException,
  forwardRef,
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

@ApiTags('Users')
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserRoleService))
    private readonly userRoleService: UserRoleService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly installerService: InstallerService,
    private readonly coordinatorService: CoordinatorsService
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
    if (userDisabled?.disabledAt) {
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

    return this.mapToUserWithRolesDto(fullUser);
  }

  private mapToUserWithRolesDto(user: User): UserWithRolesDto {
    return {
      id: user.id,
      fullName: user.fullName,
      birthDate: user.birthDate,
      country: user.country,
      address: user.address,
      idNumber: user.idNumber,
      coverage: user.coverage,
      email: user.email,
      phone: user.phone,
      location: user.location,
      createdAt: user.createdAt,
      isSubscribed: user.isSubscribed,
      disabledAt: user.disabledAt,
      userRoles:
        user.userRoles?.map((ur) => ({
          id: ur.id,
          role: {
            id: ur.role.id,
            name: ur.role.name,
          },
        })) ?? [],
        installer: user.installer ?? null,
        coordinator: user.coordinator ?? null,
        admin: user.admin ?? null,
    };
  }

  async userByEmailByDisabled(email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.email = :email', { email })
      .andWhere('user.disabledAt IS NOT NULL')
      .getOne();
  }
  
  async findAll(): Promise<UserWithRolesDto[]> {
    const users = await this.userRepository.find({
      relations: [
        'userRoles',
        'userRoles.role',
        'installer',
        'coordinator',
        'admin',
      ],
    });

    return users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      birthDate: user.birthDate,
      idNumber: user.idNumber,
      country: user.country,
      address: user.address,
      coverage: user.coverage,
      location: user.location,
      phone: user.phone,
      createdAt: user.createdAt,
      isSubscribed: user.isSubscribed,
      disabledAt: user.disabledAt,
      userRoles:
        user.userRoles?.map((ur) => ({
          id: ur.id,
          role: {
            id: ur.role.id,
            name: ur.role.name,
          },
        })) ?? [],
        installer: user.installer ?? null,
        coordinator: user.coordinator ?? null,
        admin: user.admin ?? null,
    }));
  }

  async findAllRoles() {
    return await this.roleRepository.find();
  }

  async findFilterSort(queryOptions: UserQueryOptions) {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    queryBuilder
      .leftJoinAndSelect('users.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role');

    queryBuilder.andWhere('role.name = :name', { name: queryOptions.role });

    queryBuilder
      .orderBy('users.createdAt', 'DESC')
      .skip((queryOptions.page - 1) * queryOptions.limit)
      .take(queryOptions.limit);

    const findResult: PaginationResult<User> =
      await queryBuilder.getManyAndCount();

    return findResult;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role', 'installer', 'coordinator',
      'admin'],
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async removeUser(id: string) {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado correctamente.' };
  }

  async disableUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['installer', 'coordinator'],
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

    return { message: 'Usuario reactivado correctamente' };
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
  
    return { message: 'Usuario restaurado correctamente' };
  }

  async findByIdNumber(idNumber: string) {
    return await this.userRepository.findOne({
      where: { idNumber },
    });
  }
}

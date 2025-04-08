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
import { IsNull, Not, QueryBuilder, Repository } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { UserRoleService } from '../user-role/user-role.service';
import { Role } from './entities/roles.entity';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { UserQueryOptions } from './dto/users-filter.dto';
import { UserWithRolesDto } from './dto/user-with-roles.dto';

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
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });

    return user;
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

  async softDeleteUser(id: string) {
    await this.userRepository.softDelete(id);
    return { message: 'Se desactivo correctamente' };
  }

  async restore(id: string) {
    const user = await this.findDisabledUserById(id);
    if (user && user.disabledAt !== null) {
      await this.userRepository.restore(id);
      return { message: 'Se restauro correctamente' };
    }
    throw new BadRequestException('El usuario indicado ya se encuentra activo');
  }

  async findAllWhitDeleted() {
    const users = await this.userRepository.find({
      relations: [
        'userRoles',
        'userRoles.role',
        'installer',
        'coordinator',
        'admin',
      ],
      withDeleted: true,
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

  async findDisabledUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, disabledAt: Not(IsNull()) },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('Usuario desactivado no encontrado');
    }

    return user;
  }

  async findByIdNumber(idNumber: string) {
    return await this.userRepository.findOne({
      where: { idNumber },
    });
  }
}

import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
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

@ApiTags('Users')
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserRoleService))
    private readonly userRoleService: UserRoleService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, idNumber, phone, password } = createUserDto;

    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    
    const existingIdNumber = await this.userRepository.findOne({ where: { idNumber } });
    if (existingIdNumber) {
      throw new ConflictException('El documento de identidad ya está registrado');
    }
    
    const existingPhone = await this.userRepository.findOne({ where: { phone } });
    if (existingPhone) {
      throw new ConflictException('El número de celular ya se encuentra registrado');
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

    await this.userRepository.save(newUser);

    await this.userRoleService.assignRole(newUser.id, 'Usuario');

    return newUser;
  }

  async userByEmailByDisabled(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });

    return user;
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['userRoles', 'userRoles.role'],
    });

    return users;
  }

  async findFilterSort(queryOptions: UserQueryOptions) {

    const queryBuilder = this.userRepository.createQueryBuilder('users')
    
    queryBuilder
    .leftJoinAndSelect('users.userRoles', 'userRole' )
    .leftJoinAndSelect('userRole.role', 'role')

    queryBuilder.andWhere('role.name = :name', {name: queryOptions.role})

   
    queryBuilder
      .orderBy('users.createdAt', 'DESC')
      .skip((queryOptions.page - 1) * queryOptions.limit)
      .take(queryOptions.limit);
    
    const findResult: PaginationResult<User> = await queryBuilder.getManyAndCount()

    return findResult
  }


  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
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
    return await this.userRepository.find({
      withDeleted: true,
    });
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

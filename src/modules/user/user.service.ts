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
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InstallerService } from '../installer/installer.service';
import { IsNull, Not, Repository } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entities/roles.entity';
import { Coordinator } from '../coordinators/entities/coordinator.entity';
import { hash } from 'bcrypt';

@ApiTags('Users')
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => InstallerService))
    private readonly installerService: InstallerService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Coordinator)
    private readonly coordinatorRepository: Repository<Coordinator>
  ) {}


  async createUser(createUserDto: CreateUserDto) {
    const { email, idNumber, role, phone, password} = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email }});

    if (existingUser) {

      if (existingUser.email === email) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }

      if (existingUser.idNumber === idNumber) {
        throw new ConflictException(
          'El documento de identidad ya esta registrado',
        );
      }

      if(existingUser.phone === phone) {
        throw new ConflictException(
          'El número de celular ya se encuentra registrado',
        );
      };
    };

    const userDisabled = await this.userByEmailByDisabled(email)

    if (userDisabled?.disabledAt) {
      throw new ConflictException('El correo electrónico esta deshabilitado');
    }

    let userRole = role;

    if (!userRole) {
      const foundRole = await this.roleRepository.findOne({
        where: { name: 'Usuario' },
      });

      if (foundRole) {
        userRole = foundRole;
      } else {
        userRole = this.roleRepository.create({
          name: 'Usuario',
          description: 'Rol por defecto para usuarios',
        });

        userRole = await this.roleRepository.save(userRole);
      }
    }

    const hashedPassword = await hash(password, 10)

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: userRole,
    });

    return await this.userRepository.save(newUser);
  }

  async userByEmailByDisabled(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });
  
    return user; 
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['installer']
    });
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
      relations: ['installer'], 
      withDeleted: true 
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

  async assignCoordinator(coordinatorId: string) {
    const user = await this.userRepository.findOne({
      where: {id: coordinatorId},
      relations: ['coordinador']
    })

     if (!user) {
          throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

    const role = await this.roleRepository.findOne({
      where: { name: 'Coordinador' },
    });
    if (!role) {
      throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
    }

    user.role = role;

    if (!user.coordinator) {
      const newCoordinator = this.coordinatorRepository.create({ user });
      user.coordinator = await this.coordinatorRepository.save(newCoordinator);
    }

    return await this.userRepository.save(user);
  }
}

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
import { InstallerService } from '../installer/installer.service';
import { IsNull, Not, Repository } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entities/roles.entity';

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
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente.',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto: Correo electónico o identificación ya registrada.',
  })
  async createUser(createUserDto: CreateUserDto) {
    const { email, idNumber, role, phone } = createUserDto;

    const userDisabled = await this.userByEmailByDisabled(email)

    if (userDisabled?.disabledAt) {
      throw new ConflictException('El correo electrónico esta deshabilitado');
    }

    const userExisting = await this.findByEmail(email);

    if (userExisting) {
      throw new ConflictException('El correo electrónico ya existe');
    }

    const existingNumber = await this.userRepository.findOne({where: { idNumber }});

    if (existingNumber)
      throw new ConflictException(
        'El documento de identidad ya se encuentra registrado',
      );

    const existingPhone = await this.userRepository.findOne({where: { phone }});

    if (existingPhone) {
      throw new ConflictException(
        'El número de celular ya se encuentra registrado',
      );
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

    const newUser = this.userRepository.create({
      ...createUserDto,
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

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios recuperada exitosamente.',
    type: [User],
  })
  async findAll() {
    return await this.userRepository.find({
      relations: ['installer']
    });
  }

  @ApiOperation({ summary: 'Buscar usuario por email' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  @ApiOperation({ summary: 'Buscar un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  @ApiOperation({ summary: 'Desactivar usuario (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario desactivado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async softDeleteUser(id: string) {
    await this.userRepository.softDelete(id);
    return { message: 'Se desactivo correctamente' };
  }

  @ApiOperation({ summary: 'Restaurar usuario desactivado' })
  @ApiResponse({ status: 200, description: 'Usuario restaurado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'El usuario indicado ya se encuentra activo.',
  })
  async restore(id: string) {
    const user = await this.findDisabledUserById(id);
    if (user && user.disabledAt !== null) {
      await this.userRepository.restore(id);
      return { message: 'Se restauro correctamente' };
    }
    throw new BadRequestException('El usuario indicado ya se encuentra activo');
  }

  @ApiOperation({
    summary: 'Obtener todos los usuarios, incluidos los desactivados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios recuperada exitosamente.',
    type: [User],
  })
  async findAllWhitDeleted() {
    return await this.userRepository.find({
      relations: ['installer'], 
      withDeleted: true 
    });
  }

  @ApiOperation({ summary: 'Buscar un usuario desactivado por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario desactivado encontrado exitosamente.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario desactivado no encontrado.',
  })
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
}

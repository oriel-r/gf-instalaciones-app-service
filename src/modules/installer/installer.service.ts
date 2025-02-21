import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Installer } from './entities/installer.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateInstallerDto } from './dto/create-installer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Installer')
@Injectable()
export class InstallerService {
  constructor(
    @InjectRepository(Installer)
    private readonly installerRepository: Repository<Installer>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Obtener todos los instaladores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los instaladores',
    type: [Installer],
  })
  async findAll() {
    return await this.installerRepository.find();
  }

  @ApiOperation({ summary: 'Crear un nuevo instalador' })
  @ApiResponse({
    status: 201,
    description: 'El instalador ha sido creado exitosamente',
    type: Installer,
  })
  @ApiResponse({
    status: 409,
    description: 'El email o el documento de identidad ya están registrados',
  })
  async createInstaller(createInstallerDto: CreateInstallerDto) {
    const { email, identificationNumber, password, ...installerData } =
      createInstallerDto;

    let user = await this.userService.findByEmail(email);

    if (user) {
      const existingInstaller = await this.installerRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['user'],
      });

      if (existingInstaller) {
        throw new ConflictException(
          'El email ya está registrado como instalador',
        );
      }
    } else {
      user = await this.userService.createUser({
        email,
        password,
        identificationNumber,
        ...installerData,
      });
    }

    const existingNumber = await this.installerRepository.findOne({
      where: { user: { identificationNumber } },
      relations: ['user'],
    });

    if (existingNumber) {
      throw new ConflictException(
        'El documento de identidad ya se encuentra registrado',
      );
    }

    const newInstaller = this.installerRepository.create({
      ...installerData,
      user: user,
    });

    const installer = await this.installerRepository.save(newInstaller);
    return installer;
  }

  @ApiOperation({ summary: 'Buscar instalador por correo electrónico' })
  @ApiResponse({
    status: 200,
    description: 'Instalador encontrado por correo electrónico',
    type: Installer,
  })
  @ApiResponse({
    status: 404,
    description: 'Instalador no encontrado',
  })
  async findByEmail(email: string) {
    return await this.installerRepository.findOne({
      where: { user: { email } },
      relations: ['user'],
    });
  }

  @ApiOperation({ summary: 'Deshabilitar un instalador' })
  @ApiResponse({
    status: 200,
    description: 'El instalador ha sido deshabilitado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Instalador no encontrado',
  })
  async softDelete(id: string) {
    await this.installerRepository.softDelete(id);
    const installer = await this.findDisabledInstallerById(id);
    if (installer!.user) {
      await this.userService.softDelete(installer!.user.id);
    }
    return { message: 'Se desactivó correctamente' };
  }
  
  @ApiOperation({ summary: 'Restaurar un instalador deshabilitado' })
  @ApiResponse({
    status: 200,
    description: 'El instalador ha sido restaurado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'El instalador ya está activo',
  })
  async restore(id: string) {
    const installer = await this.findDisabledInstallerById(id);
    if (installer && installer.disabledAt !== null) {
      await this.installerRepository.restore(id);
      return { message: 'Se restauro correctamente' };
    }
    throw new BadRequestException(
      'El intalador indicado ya se encuentra activo',
    );
  }

  @ApiOperation({ summary: 'Obtener todos los instaladores, incluyendo los eliminados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de instaladores, incluyendo los eliminados',
    type: [Installer],
  })
  async findAllWithDeleted() {
    return await this.installerRepository.find({ withDeleted: true });
  }

  @ApiOperation({ summary: 'Buscar un instalador deshabilitado por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalles del instalador deshabilitado',
    type: Installer,
  })
  @ApiResponse({
    status: 404,
    description: 'Instalador deshabilitado no encontrado',
  })
  async findDisabledInstallerById(installerId: string): Promise<Installer | null> {
    const installer = await this.installerRepository.findOne({
      where: { id: installerId, disabledAt: Not(IsNull()) },
      withDeleted: true,
    });
  
    if (!installer) {
      throw new NotFoundException('Instalador desactivado no encontrado');
    }
  
    return installer;
  }
  
  @ApiOperation({ summary: 'Buscar instalador por ID' })
  @ApiResponse({
    status: 200,
    description: 'Instalador encontrado por ID',
    type: Installer,
  })
  @ApiResponse({
    status: 404,
    description: 'Instalador no encontrado',
  })
  async findById(id: string) {
    const installer = await this.installerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!installer) throw new NotFoundException('Instalador no encontrado');
    return installer;
  }
}

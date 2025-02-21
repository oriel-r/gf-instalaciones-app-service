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

@Injectable()
export class InstallerService {
  constructor(
    @InjectRepository(Installer)
    private readonly installerRepository: Repository<Installer>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async findAll() {
    return await this.installerRepository.find();
  }

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

  async findByEmail(email: string) {
    return await this.installerRepository.findOne({
      where: { user: { email } },
      relations: ['user'],
    });
  }

  async softDelete(id: string) {
    await this.installerRepository.softDelete(id);
    const installer = await this.findDisabledInstallerById(id);
    if (installer!.user) {
      await this.userService.softDelete(installer!.user.id);
    }
    return { message: 'Se desactivó correctamente' };
  }
  

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

  async findAllWhitDeleted() {
    return await this.installerRepository.find({ withDeleted: true });
  }

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
  

  async findById(id: string) {
    const installer = await this.installerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!installer) throw new NotFoundException('Instalador no encontrado');
    return installer;
  }
}

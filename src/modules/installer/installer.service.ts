import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Installer } from './entities/installer.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateInstallerDto } from './dto/create-installer.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateInstallerDto } from './dto/update-installer';
import { UserRoleService } from '../user-role/user-role.service';

@ApiTags('Installer')
@Injectable()
export class InstallerService {
  constructor(
    @InjectRepository(Installer)
    private readonly installerRepository: Repository<Installer>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async findAll() {
    return await this.installerRepository.find({
      relations: ['userRoleDetail', 'userRoleDetail.user'],
    });
  }

  async createInstaller(createInstallerDto: CreateInstallerDto) {
    const {
      email,
      idNumber,
      password,
      fullName,
      location,
      address,
      country,
      phone,
      birthDate,
      ...installerData
    } = createInstallerDto;
  
    let user = await this.userService.findByEmail(email);
    if (user) {
      const existingInstaller = await this.userRoleService.findUserRoleById(user.id);
  
      if (existingInstaller && existingInstaller.role.name === 'Instalador') {
        throw new ConflictException('El email ya está registrado como instalador');
      }
    }
  
    const existingIdNumber = await this.userService.findByIdNumber(idNumber);
    if (existingIdNumber) {
      throw new ConflictException('El documento de identidad ya se encuentra registrado');
    }
  
    user = await this.userService.createUser({
      email,
      password,
      idNumber,
      fullName,
      location,
      address,
      country,
      phone,
      birthDate,
    });
  
    const userRole = await this.userRoleService.assignRole(user.id, 'Instalador');
  
    const newInstaller = this.installerRepository.create({
      ...installerData,
      userRoleDetail: userRole,
    });
  
    await this.installerRepository.save(newInstaller);
  
    return newInstaller;
  }  

  async updateInstaller(
    updateInstaller: UpdateInstallerDto,
    installerId: string,
  ) {
    const installer = await this.findById(installerId);
    Object.assign(installer, updateInstaller);
    return await this.installerRepository.save(installer);
  }

  /*  async softDelete(id: string) {
    const installer = await this.installerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!installer) {
      throw new NotFoundException('Instalador no encontrado');
    }

    if (installer.user) {
      await this.userService.softDeleteUser(installer.user.id);

      return { message: 'El instalador ha sido deshabilitado correctamente' };
    }
  } */

  /*  async restore(id: string) {
    const installer = await this.findDisabledInstallerById(id);
    if (installer && installer.user.disabledAt !== null) {
      await this.installerRepository.restore(id);
      return { message: 'Se restauro correctamente' };
    }
    throw new BadRequestException(
      'El intalador indicado ya se encuentra activo',
    );
  } */

  async findAllWithDeleted() {
    return await this.installerRepository.find({ withDeleted: true });
  }

  /*  async findDisabledInstallerById(
    installerId: string,
  ): Promise<Installer | null> {
    const installer = await this.installerRepository.findOne({
      where: {
        id: installerId,
        user: { disabledAt: Not(IsNull()) },
      },
      relations: ['user'],
      withDeleted: true,
    });

    if (!installer) {
      throw new NotFoundException('Instalador desactivado no encontrado');
    }
    return installer;
  } */

  async findById(id: string) {
    const installer = await this.installerRepository.findOneBy({ id });
    if (!installer) throw new NotFoundException('Instalador no encontrado');
    return installer;
  }
}

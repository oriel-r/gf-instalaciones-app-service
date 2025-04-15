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
import { ApiTags } from '@nestjs/swagger';
import { UpdateInstallerDto } from './dto/update-installer';
import { UserRoleService } from '../user-role/user-role.service';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { Role } from '../user/entities/roles.entity';
import { InstallerResponseDto } from './dto/installer-response.dto';
import { User } from '../user/entities/user.entity';
import { StatusInstaller } from 'src/common/enums/status-installer';

@ApiTags('Installer')
@Injectable()
export class InstallerService {
  constructor(
    @InjectRepository(Installer)
    private readonly installerRepository: Repository<Installer>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    const installers = await this.installerRepository.find({
      relations: ['user','coordinator'],
    });
    
    if (!installers) throw new NotFoundException('Usuarios no encontrados');

    return installers;
  }

  async createInstaller(createInstallerDto: CreateInstallerDto) {
    const user = await this.userService.findById(createInstallerDto.userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const existingInstaller = await this.installerRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existingInstaller) {
      throw new ConflictException('Este usuario ya es instalador');
    }

    let role = await this.roleRepository.findOneBy({ name: RoleEnum.INSTALLER});
    if (!role) {
      role = this.roleRepository.create({ name: RoleEnum.INSTALLER });
      role = await this.roleRepository.save(role);
    }

    await this.userRoleService.assignRole(user.id, role.id);

    const newInstaller = this.installerRepository.create({
      user,
      ...createInstallerDto,
    });

     const savedInstaller = await this.installerRepository.save(newInstaller);

     const fullUser = await this.userService.findById(user.id);

    return this.mapToInstallerResponse(savedInstaller, fullUser);
  }

  private mapToInstallerResponse(installer: Installer, user: User): InstallerResponseDto {
    return {
      id: installer.id,
      taxCondition: installer.taxCondition,
      queries: installer.queries,
      hasPersonalAccidentInsurance: installer.hasPersonalAccidentInsurance,
      canWorkAtHeight: installer.canWorkAtHeight,
      canTensionFrontAndBackLonas: installer.canTensionFrontAndBackLonas,
      canInstallCorporealSigns: installer.canInstallCorporealSigns,
      canInstallFrostedVinyl: installer.canInstallFrostedVinyl,
      canInstallVinylOnWallsOrGlass: installer.canInstallVinylOnWallsOrGlass,
      canDoCarWrapping: installer.canDoCarWrapping,
      hasOwnTransportation: installer.hasOwnTransportation,
      status: installer.status,
      user: {
        id: user.id,
        fullName: user.fullName,
        birthDate: user.birthDate,
        country: user.country,
        address: user.address,
        idNumber: user.idNumber,
        location: user.location,
        coverage: user.coverage,
        email: user.email,
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
    }
    };
  }

  async updateInstaller(
    updateInstaller: UpdateInstallerDto,
    installerId: string,
  ) {
    delete updateInstaller.status;
    const installer = await this.findById(installerId);
    Object.assign(installer, updateInstaller);
    return await this.installerRepository.save(installer);
  }

  async updateStatus(installerId: string, status: StatusInstaller) {
    const installer = await this.findById(installerId);
    installer.status = status;
    await this.installerRepository.save(installer);
    return {message: 'Estado actualizado correctamente'}
  }

  async disable(id: string) {
    const installer = await this.findById(id);
    if (installer.disabledAt) {
      throw new BadRequestException('Este instalador ya está deshabilitado');
    }
  
    installer.disabledAt = new Date();
    await this.installerRepository.save(installer);
    return { message: 'Instalador desactivado correctamente' };
  }
  
  async restore(id: string) {
    const installer = await this.findById(id);
    if (!installer.disabledAt) {
      throw new BadRequestException('Este instalador ya está activo');
    }
  
    installer.disabledAt = null;
    await this.installerRepository.save(installer);
    return { message: 'Instalador restaurado correctamente' };
  } 

  async findById(id: string) {
    const installer = await this.installerRepository.findOne({ 
      where: {id},
      relations: ['user']
    });

    if (!installer) throw new NotFoundException('Instalador no encontrado');
    return installer;
  }

  async findByEmail(email: string)  {
    const installer = await this.installerRepository.findOne({
      where: { user: { email } },
      relations: ['user'],
    });
  
    if (!installer) throw new NotFoundException('Instalador no encontrado');
  
    return installer;
  } 

  async delete(id: string) {
    const installer = await this.findById(id);
    await this.installerRepository.remove(installer);
    return { message: 'Instalador eliminado correctamente.' };
  }
}

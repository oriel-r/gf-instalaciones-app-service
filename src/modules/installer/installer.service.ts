import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SyncWithSheetsEnum } from 'src/common/enums/sync-with-sheets-event.enum';

@ApiTags('Installer')
@Injectable()
export class InstallerService {
  constructor(
    @InjectRepository(Installer)
    private readonly installerRepository: Repository<Installer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    const installers = await this.installerRepository.find({
      relations: ['user', 'coordinator'],
    });

    if (!installers) throw new NotFoundException('Usuarios no encontrados');

    return plainToInstance(InstallerResponseDto, installers, {
      excludeExtraneousValues: true,
    });
  }

  async createInstaller(createInstallerDto: CreateInstallerDto) {
    const user = await this.userRepository.findOne({
      where: { id: createInstallerDto.userId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const existingInstaller = await this.installerRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existingInstaller) {
      throw new ConflictException('Este usuario ya es instalador');
    }

    let role = await this.roleRepository.findOneBy({
      name: RoleEnum.INSTALLER,
    });
    if (!role) {
      role = this.roleRepository.create({ name: RoleEnum.INSTALLER });
      role = await this.roleRepository.save(role);
    }

    await this.userRoleService.assignRole(user.id, role.id);

    const newInstaller = this.installerRepository.create({
      user,
      ...createInstallerDto,
      status: createInstallerDto.status ?? StatusInstaller.InProcess,
    });

    const savedInstaller = await this.installerRepository.save(newInstaller);

    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!fullUser) {
      throw new InternalServerErrorException(
        'Error al cargar el usuario completo',
      );
    }

    return plainToInstance(
      InstallerResponseDto,
      { ...savedInstaller, user: fullUser },
      { excludeExtraneousValues: true },
    );
  }

  async updateInstaller(
    updateInstaller: UpdateInstallerDto,
    installerId: string,
  ) {
    delete updateInstaller.status;
    const installer = await this.findById(installerId);
    Object.assign(installer, updateInstaller);
    const update = await this.installerRepository.save(installer);
    return plainToInstance(InstallerResponseDto, update, {
      excludeExtraneousValues: true,
    });
  }

  async updateStatus(installerId: string, status: StatusInstaller) {
    const installer = await this.findById(installerId);
    installer.status = status;
    await this.installerRepository.save(installer);
    await this.eventEmitter.emitAsync(SyncWithSheetsEnum.APPEND_ROW, {
      sheet: 'INSTALADORES',
      values: [installer.user.fullName, installer.user.email],
    });

    return { message: 'Estado actualizado correctamente' };
  }

  async disable(id: string) {
    const installer = await this.installerRepository.findOne({ where: { id } });

    if (!installer) throw new NotFoundException('Instalador no encontrado');

    if (installer.disabledAt) {
      throw new BadRequestException('Este instalador ya está deshabilitado');
    }

    installer.disabledAt = new Date();
    await this.installerRepository.save(installer);
    return { message: 'Instalador desactivado correctamente' };
  }

  async restore(id: string) {
    const installer = await this.installerRepository.findOne({ where: { id } });

    if (!installer) throw new NotFoundException('Instalador no encontrado');

    if (!installer.disabledAt) {
      throw new BadRequestException('Este instalador ya está activo');
    }

    installer.disabledAt = null;
    await this.installerRepository.save(installer);
    return { message: 'Instalador restaurado correctamente' };
  }

  async findById(id: string) {
    const installer = await this.installerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!installer) throw new NotFoundException('Instalador no encontrado');
    return installer;
  }

  async findByEmail(email: string, raw?: boolean) {
    const installer = await this.installerRepository.findOne({
      where: { user: { email } },
      relations: ['user'],
    });

    if (!installer) throw new NotFoundException('Instalador no encontrado');
    if (raw) return installer;

    return plainToInstance(InstallerResponseDto, installer, {
      excludeExtraneousValues: true,
    });
  }

  async delete(userId: string) {
    const installer = await this.installerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!installer) {
      throw new NotFoundException('Instalador no encontrado');
    }

    await this.installerRepository.remove(installer);
    return { message: 'Instalador eliminado correctamente.' };
  }
}

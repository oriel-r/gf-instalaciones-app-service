import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { InstallationsRepository } from './installations.repository';
import { DeepPartial } from 'typeorm';
import { Installation } from './entities/installation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { AddressService } from 'src/modules/locations/address/address.service';
import { Order } from '../orders/entities/order.entity';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRoleService } from 'src/modules/user-role/user-role.service';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { InstallerService } from 'src/modules/installer/installer.service';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';

@Injectable()
export class InstallationsService {
  constructor(
    private readonly installationsRepository: InstallationsRepository,
    private readonly addressService: AddressService,
    private readonly fileUploadService: FileUploadService,
    private readonly userRoleService: UserRoleService,
    private readonly installerService: InstallerService,
    private evenEmitter: EventEmitter2
  ){}
  
  async createFromOrder(createInstallationDto: CreateInstallationDto) {

    const newInstallations = await Promise.all(
      createInstallationDto.installations.map(async (installation) => {
        const { address, coordinatorId, installersIds, ...otherData } = installation;

        const coordinator = await this.userRoleService.getByIdWhenRole(coordinatorId, RoleEnum.COORDINATOR)
        
        const getInstallers = await Promise.all(
        installersIds.map( async(installer) => {
           return await this.installerService.findById(installer)
        }))
              
        const installers = getInstallers.filter((i): i is Installer => i !== null)
              
        if(!coordinator) throw new BadRequestException('Coordinador no encontrado')
        
        if(!installers.length) throw new BadRequestException('No se encontraron los instaladores')

        const installationAddress = await this.addressService.create(address);
  
        return await this.installationsRepository.create({
          ...otherData,
          installers: installers,
          coordinator: coordinator, 
          order: createInstallationDto.order,
          address: installationAddress,
        })

      })
    );
  
    return newInstallations;
  }
  
  async create(data) {
    return {newData: data}
  }

  async findAll() {
    const installations = await this.installationsRepository.get()
    if(!installations.length) throw new NotFoundException('No se encontraron isntalaciones')
      return installations
  }

  async findOne(id: string) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
      return installation  }

  async update(id: string, updateInstallationDto: DeepPartial<Installation>) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.installationsRepository.update(id, updateInstallationDto)
    if(!result.affected) throw new InternalServerErrorException('No se pudo actualizar el estado de la orden')
    return await this.installationsRepository.getById(id)
  }

  async sendToReview(id: string, data) {
    const installation = await this.findOne(id)
    const imagesUrls = await Promise.all(data.map((image) =>
      this.fileUploadService.uploadFile(image)
    ))

    if(!imagesUrls || !imagesUrls.length ) throw new ServiceUnavailableException('Hubo un problema al subir la imagen')
    const result = await this.update(installation.id, {images: imagesUrls})
    this.evenEmitter.emit('installation.sendToReview', id)
    return await this.findOne(id)
  }

  async remove(id: string) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.installationsRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('instalación', id)
  }
}

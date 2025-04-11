import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { InstallationsRepository } from './installations.repository';
import { DeepPartial } from 'typeorm';
import { Installation } from './entities/installation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { AddressService } from 'src/modules/locations/address/address.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRoleService } from 'src/modules/user-role/user-role.service';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { InstallerService } from 'src/modules/installer/installer.service';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';
import { NotifyEvents } from 'src/common/enums/notifications-events.enum';
import { InstallationApprovedDto } from 'src/modules/notifications/dto/installation-aproved.dto';
import { InstallationGeneralUpdate } from 'src/modules/notifications/dto/installation-general-update.dto';
import { InstallationPostponedDto } from 'src/modules/notifications/dto/installation-postponed.dto';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { InstallationCancelDto } from 'src/modules/notifications/dto/intallation-cancel.dto';
import { FileUploadService } from 'src/services/files/file-upload.service';
import { allowedTransitions } from './helpers/allowed-transitions.const';
import { ImagesService } from 'src/modules/images/images.service';
import { InstallationToReviewDto } from 'src/modules/notifications/dto/installation-to-review.dto';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { StatusChangeDto } from './dto/change-status.dto';

@Injectable()
export class InstallationsService {
  constructor(
    private readonly installationsRepository: InstallationsRepository,
    private readonly addressService: AddressService,
    private readonly fileUploadService: FileUploadService,
    private readonly imageService: ImagesService,
    private readonly userRoleService: UserRoleService,
    private readonly installerService: InstallerService,
    private eventEmitter: EventEmitter2
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
      return installation  
    }

    async update(id: string, data: UpdateInstallationDto) {
      // Buscar la instalación por su id
      const installation = await this.installationsRepository.getById(id);
      if (!installation) {
        throw new NotFoundException("No se encontró la instalación");
      }
    
      // Verificar que el estado de la instalación sea PENDING o POSTPONED
      if (![InstallationStatus.PENDING, InstallationStatus.POSTPONED].includes(installation.status)) {
        throw new BadRequestException(`No se puede modificar una instalación con estado ${installation.status}`);
      }
    
      let installers: Installer[] = [];
    
      if (data.installersIds && data.installersIds.length > 0) {
        installers = await Promise.all(
          data.installersIds.map(async installerId => {
            const installer = await this.installerService.findById(installerId);
            if (!installer) {
              throw new NotFoundException(`Instalador con id ${installerId} no encontrado`);
            }
            return installer;
          })
        );
      }
    
      if (installation.status === InstallationStatus.POSTPONED && data.startDate) {
        const newStartDate = new Date(data.startDate);
        const currentStartDate = new Date(installation.startDate);
        if (newStartDate <= currentStartDate) {
          throw new BadRequestException("La nueva fecha de inicio debe ser posterior a la fecha actual de la instalación");
        }
      }
    
      const updateData: Partial<Installation> = {};
      if (data.startDate) {
        updateData.startDate = data.startDate;
      }
      if (installers.length > 0) {
        updateData.installers = installers;
      }

    
      const updatedInstallation = await this.installationsRepository.update(id, updateData);
      
      
      return updatedInstallation

    }
    

  async statusChange(id: string, updateInstallationDto: StatusChangeDto) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    
    const currentStatus = installation.status
    const newStatus = updateInstallationDto.status

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    throw new BadRequestException(`Transición de estado no permitida: ${currentStatus} -> ${newStatus}`)
     }
    
    try {
  
      const result = await this.installationsRepository.update(id, updateInstallationDto)
      if(!result) throw new InternalServerErrorException('No se pudo actualizar el estado de la orden')
      
      if (result.status !== installation.status && result.order.client && result.coordinator?.id && result.address && result.installers ) {

        switch (result.status) {

          case InstallationStatus.IN_PROCESS:
            this.emitGeneralUpdate(
              result.order.client?.id,
              result.coordinator?.id,
              result.address
              )
            break
          case InstallationStatus.POSTPONED:
            this.emitPostponedUpdate(result.coordinator.id, result.address)
            break
          case InstallationStatus.CANCEL:
              this.emitCancelledUpdate(result.order.client.id, result.installers)
              break
          default:
            this.emitApprovedUpdate(result.order.client.id, result.installers, result.address)
          }
      return await this.installationsRepository.getById(id)
    }
    } catch (err){
      console.log(err)
    }
  }

  async sendToReview(id: string, files: Express.Multer.File[]) {
    const installation = await this.installationsRepository.getById(id)

    if(!installation) throw new NotFoundException('No se encontro la isntalción')

    if(installation.status !== InstallationStatus.IN_PROCESS) {
      throw new BadRequestException(
        `Transición de estado no permitida:
         ${installation.status} -> ${InstallationStatus.TO_REVIEW}`
      )
    }

    const imagesUrls: string[] = await Promise.all(
      files.map(async (file) => {
        const fileUrl = await this.fileUploadService.uploadFile(file);
        await this.imageService.saveFile({
          url: fileUrl,
          mimetype: file.mimetype,
        });
        return fileUrl
       }),
    );

    if(!imagesUrls.length ) throw new ServiceUnavailableException('Hubo un problema al subir las imagenes')
    const result = await this.installationsRepository.update(installation.id, {status: InstallationStatus.TO_REVIEW, images: imagesUrls})
    if(!result) throw new InternalServerErrorException('No se pudo cambiar el estado')
    
    this.emitToReviewUpdate(installation.order.client!.id, installation.coordinator!.id, installation.address)
    return result
  }

  async remove(id: string) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.installationsRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('instalación', id)
  }

  private emitGeneralUpdate(clientId: string, coordinatorId: string, address: Address) {
    this.eventEmitter.emit(
      NotifyEvents.INSTALLATION_GENERAL_UPDATE,
      new InstallationGeneralUpdate(clientId, coordinatorId, address)
    )
  }
  
  private emitPostponedUpdate(coordinatorId: string, address: Address) {
    this.eventEmitter.emit(
      NotifyEvents.INSTALLATION_POSTPONED,
      new InstallationPostponedDto(coordinatorId, address)
    )
  }
  
  private emitApprovedUpdate(clientId: string, installers: any, address: Address) {
    this.eventEmitter.emit(
      NotifyEvents.INSTALLATION_APROVE,
      new InstallationApprovedDto(clientId, installers, address)
    )
  }

  private emitToReviewUpdate(clientId: string, coordinatorId: string , address: Address) {
    this.eventEmitter.emit(
      NotifyEvents.INSTALLATION_TO_REVIEW,
      new InstallationToReviewDto(clientId, address)
    )
  }

  private emitCancelledUpdate(clientId: string, installers: any) {
    this.eventEmitter.emit(
      NotifyEvents.INSTALLATION_CANCELLED,
      new InstallationCancelDto(clientId, installers)
    )
  }
}

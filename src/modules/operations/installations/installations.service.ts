import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
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
import { allowedTransitions } from './helpers/allowed-transitions.const';
import { ImagesService } from 'src/modules/images/images.service';
import { InstallationToReviewDto } from 'src/modules/notifications/dto/installation-to-review.dto';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { StatusChangeDto } from './dto/change-status.dto';
import { InstallationQueryOptionsDto } from './dto/installation-query-options.dto';
import { PaginatedResponseDto } from 'src/common/entities/paginated-response.dto';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { TemporalUploadService } from 'src/services/temporal-file-upload/temporal-file-upload.service';
import { OrderEvent } from 'src/common/enums/orders-event.enum';
import { RecalculateProgressDto } from '../orders/dto/recalculate-progress.dto';
import { StatusInstaller } from 'src/common/enums/status-installer';
import { usersData } from 'src/seeders/users/users.mock';


@Injectable()
export class InstallationsService {
  constructor(
    private readonly installationsRepository: InstallationsRepository,
    private readonly addressService: AddressService,
    private readonly imageService: ImagesService,
    private readonly userRoleService: UserRoleService,
    private readonly installerService: InstallerService,
    private eventEmitter: EventEmitter2,
    private readonly temporalUploadService: TemporalUploadService
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
         if(!installers.length) throw new BadRequestException('No se encontraron los instaladores')      

        if(!coordinator) throw new BadRequestException('Coordinador no encontrado')
        
        if(installers.some((i) => i.status !== StatusInstaller.Approved)) throw new HttpException('Estas intentando asignar instaladores no aprobados', HttpStatus.UNPROCESSABLE_ENTITY)
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

  async findAll( query: InstallationQueryOptionsDto, coordinatorId?: string, installerId?: string) {
      
    const result = await this.installationsRepository.getAllByOrder(query, undefined, coordinatorId, installerId)
     return new PaginatedResponseDto<Installation>(result, query.page, query.limit)

  }

  async getAll() {
    return await this,this.installationsRepository.get()
  }

  async filterFromOrder(orderId: string, query: InstallationQueryOptionsDto) {
      const result: PaginationResult<Installation> = await this.installationsRepository.getAllByOrder(query, orderId)
      return new PaginatedResponseDto<Installation>(result, query.page, query.limit)
  }

  async findOne(id: string) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
      return installation  
    }

    async update(id: string, data: UpdateInstallationDto) {
      const installation = await this.installationsRepository.getById(id);
      if (!installation) {
        throw new NotFoundException("No se encontró la instalación");
      }
      if (![InstallationStatus.PENDING, InstallationStatus.POSTPONED].includes(installation.status)) {
        throw new BadRequestException(`No se puede modificar una instalación con estado ${installation.status}`);
      }
    
      let installers: Installer[] | null = null;
      let newCoordinator: UserRole | null = null
      let newAddress: Address | null = null

      if (data.installersIds && data.installersIds.length > 0) {
        installers = await Promise.all(
          data.installersIds.map(async (installerId) => {
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
        const currentStartDate = installation.startDate;
        if (newStartDate <= currentStartDate) {
          throw new BadRequestException("La nueva fecha de inicio debe ser posterior a la fecha actual de la instalación");
        }
      }

      if(data.coordinatorId) {
        newCoordinator = await this.userRoleService.getByIdWhenRole(data.coordinatorId, RoleEnum.COORDINATOR)
      }

      if(data.addressId && data.addressData) {
        newAddress = await this.addressService.update(data.addressId, data.addressData )
      }

    
      const updateData: Partial<Installation> = {};
      if (data.startDate) {
        updateData.startDate = new Date(data.startDate);
      }
      if (installers) {
        updateData.installers = installers;
      }
      if(newAddress) {
        updateData.address = newAddress
      }
      if(newCoordinator) {
        updateData.coordinator = newCoordinator
      }
      updateData.status = InstallationStatus.PENDING

      const updatedInstallation = await this.installationsRepository.update(id, updateData);
      return updatedInstallation

    }
    

    async statusChange(id: string, dto: StatusChangeDto) {
    const installation = await this.installationsRepository.getById(id);
    if (!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente');
    if (!allowedTransitions[installation.status]?.includes(dto.status)) {
      throw new BadRequestException(`Transición de estado no permitida: ${installation.status} -> ${dto.status}`);
    }

    const updateData: Partial<Installation> = { ...dto };
    const now = new Date();

    if (dto.status === InstallationStatus.IN_PROCESS) {
      updateData.startedAt = now;
    }

    if ([InstallationStatus.CANCEL, InstallationStatus.FINISHED].includes(dto.status)) {
      updateData.endDate = now;
    }

    const result = await this.installationsRepository.update(id, updateData);
    if (!result) throw new InternalServerErrorException('No se pudo actualizar el estado de la instalación');

    if (result.status !== installation.status) {
      switch (result.status) {
        case InstallationStatus.IN_PROCESS:
          if (result.order?.client && result.coordinator?.id && result.address) {
            this.emitGeneralUpdate(result.order.client.id, result.coordinator.id, result.address);
          }
          break;
        case InstallationStatus.POSTPONED:
          if (result.coordinator?.id && result.address) {
            this.emitPostponedUpdate(result.coordinator.id, result.address);
          }
          break;
        case InstallationStatus.CANCEL:
          if (result.order?.client && result.installers) {
            this.emitCancelledUpdate(result.order.client.id, result.installers);
            this.emitRecalculateOrderProgress({ orderId: result.order.id });
          }
          break;
        case InstallationStatus.FINISHED:
          if (result.order?.client && result.installers && result.address) {
            this.emitApprovedUpdate(result.order.client.id, result.installers, result.address, result.order.id);
            this.emitRecalculateOrderProgress({ orderId: result.order.id });
          }
          break;
        default:
          if (result.order?.client && result.installers && result.address) {
            this.emitApprovedUpdate(result.order.client.id, result.installers, result.address, result.order.id);
            this.emitRecalculateOrderProgress({ orderId: result.order.id });
          }
      }
    }

    return await this.installationsRepository.getById(id);
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
        const fileUrl = await this.temporalUploadService.uploadFile(file.buffer);
        await this.imageService.saveFile({
          url: fileUrl,
          mimetype: file.mimetype,
        });
        return fileUrl
       }),
    );

    if(!imagesUrls.length ) throw new ServiceUnavailableException('Hubo un problema al subir las imagenes')
    const result = await this.installationsRepository.update(id, {status: InstallationStatus.TO_REVIEW, images: imagesUrls, submittedForReviewAt: new Date()})
    if(!result) throw new InternalServerErrorException('No se pudo cambiar el estado')
    
    if(installation.order.client?.id && installation.coordinator?.id) {
      this.emitToReviewUpdate(installation.order.client.id, installation.coordinator.id, installation.address, imagesUrls)
    }
    return result
  }

  async remove(id: string) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.installationsRepository.softDelete(id)
    if(!result.affected) throw new InternalServerErrorException('No se pudo eliminar la isntlación')
    if(installation.order.id) this.emitRecalculateOrderProgress({orderId: installation.order.id})
      return new DeleteResponse('instalación', id)
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
  
  private emitApprovedUpdate(clientId: string, installers: any, address: Address, orderId: string) {
    this.eventEmitter.emit(
      NotifyEvents.INSTALLATION_APROVE,
      new InstallationApprovedDto(clientId, installers, address, orderId)
    )
  }

  private emitToReviewUpdate(clientId: string, coordinatorId: string , address: Address, images: string[]) {
    this.eventEmitter.emit(
      NotifyEvents.INSTALLATION_TO_REVIEW,
      new InstallationToReviewDto(clientId, coordinatorId, address, images)
    )
  }

  private emitCancelledUpdate(clientId: string, installers: any) {
    this.eventEmitter.emit(
      NotifyEvents.INSTALLATION_CANCELLED,
      new InstallationCancelDto(clientId, installers)
    )
  }

  private emitRecalculateOrderProgress(data: RecalculateProgressDto) {
    this.eventEmitter.emit(OrderEvent.RECALCULATE,data)
  }
}

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
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
import { CreateAddressDto } from 'src/modules/locations/address/dto/create-address.dto';
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
import { OrderEvent } from 'src/common/enums/orders-event.enum';
import { RecalculateProgressDto } from '../orders/dto/recalculate-progress.dto';
import { StatusInstaller } from 'src/common/enums/status-installer';
import { usersData } from 'src/seeders/users/users.mock';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { ImagesRejectedEvent } from 'src/modules/notifications/dto/images-rejected-event.dto';
import { InstallationCreatedEvent } from 'src/modules/notifications/dto/installation.created.event';

@Injectable()
export class InstallationsService {
  constructor(
    private readonly installationsRepository: InstallationsRepository,
    private readonly addressService: AddressService,
    private readonly imageService: ImagesService,
    private readonly fileUploadService: FileUploadService,
    private readonly userRoleService: UserRoleService,
    private readonly installerService: InstallerService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createFromOrder(createInstallationDto: CreateInstallationDto) {
    const { installation, order } = createInstallationDto;
    const {
      address,
      coordinatorsIds,
      installersIds,
      installersEmails,
      coordinatorsEmails,
      ...otherData
    } = installation;
    const coordinators = await this.getValidCoordinator({
      coordinatorsIds: coordinatorsIds,
      coordinatorsEmails: coordinatorsEmails,
    });
    const installers = await this.getValidInstallers({
      installersIds: installersIds,
      installersEmails: installersEmails,
    });

    const installationAddress = address
      ? await this.addressService.create(address)
      : null;

    const newInstallation = await this.installationsRepository.create({
      ...otherData,
      installers,
      coordinator: coordinators,
      order,
      address: installationAddress,
    });

    await this.eventEmitter.emitAsync(
      NotifyEvents.INSTALLATION_CREATED,
      new InstallationCreatedEvent(newInstallation as Installation),
    );

    return newInstallation;
  }

  async create(data) {
    return { newData: data };
  }

  async findAll(
    query: InstallationQueryOptionsDto,
    coordinatorId?: string,
    installerId?: string,
  ) {
    const result = await this.installationsRepository.getAllByOrder(
      query,
      undefined,
      coordinatorId,
      installerId,
    );
    return new PaginatedResponseDto<Installation>(
      result,
      query.page,
      query.limit,
    );
  }

  async getAll(roles?: [{name: string, id: string}]) {
  
  let rolesByName: Record<string, string> | null = null
   
  if( roles) {
      rolesByName = Object.fromEntries(roles?.map(({name, id}) => [name, id]))
    }
    
    console.log(rolesByName)


    const installations = await this.installationsRepository.get();
    return installations
  }

  async filterFromOrder(orderId: string, query: InstallationQueryOptionsDto) {
    const result: PaginationResult<Installation> =
      await this.installationsRepository.getAllByOrder(query, orderId);
    return new PaginatedResponseDto<Installation>(
      result,
      query.page,
      query.limit,
    );
  }

  async findOne(id: string) {
    const installation = await this.installationsRepository.getById(id);
    if (!installation)
      throw new NotFoundException(
        'Instalación no encontrada, id incorrecto o inexistente',
      );
    return installation;
  }

  async update(id: string, data: UpdateInstallationDto) {
    const installation = await this.installationsRepository.getById(id);

    if (!installation) {
      throw new NotFoundException('No se encontró la instalación');
    }
    if (
      ![InstallationStatus.PENDING, InstallationStatus.POSTPONED].includes(
        installation.status,
      )
    ) {
      throw new BadRequestException(
        `No se puede modificar una instalación con estado ${installation.status}`,
      );
    }

    let installers: Installer[] | null = null;
    let newCoordinators: UserRole[] | null = null;
    let newAddress: Address | null = null;

    if (data.installersIds && data.installersIds.length > 0) {
      installers = await this.getValidInstallers({
        installersIds: data.installersIds,
        installersEmails: undefined,
      });
    }

    if (
      installation.status === InstallationStatus.POSTPONED &&
      data.startDate
    ) {
      const newStartDate = new Date(data.startDate);
      const currentStartDate = installation.startDate;
      if (newStartDate <= currentStartDate) {
        const currentString = currentStartDate.toISOString().slice(0, 10);
        throw new BadRequestException(
          `La nueva fecha de inicio debe ser posterior a ${currentString}`,
        );
      }
    }

    if (data.coordinatorsIds) {
      newCoordinators = await this.getValidCoordinator({
        coordinatorsIds: data.coordinatorsIds,
        coordinatorsEmails: undefined,
      });
    }

    if (data.addressId === null || data.addressData === null) {
      throw new BadRequestException('Los campos de dirección no pueden ser nulos');
    }

    const hasAddressId = data.addressId !== undefined;
    const hasAddressData = data.addressData !== undefined;

    if (hasAddressData && !hasAddressId) {
      newAddress = await this.addressService.create(
        data.addressData as CreateAddressDto,
      );
    }

    if (hasAddressId && !hasAddressData) {
      newAddress = await this.addressService.findOne(data.addressId!);
    }

    if (hasAddressId && hasAddressData) {
      if (!installation.address || installation.address.id !== data.addressId) {
        throw new BadRequestException('Dirección inválida para editar');
      }
      newAddress = await this.addressService.update(
        data.addressId,
        data.addressData,
      );
    }

    const updateData: Partial<Installation> = {};
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (installers?.length) {
      updateData.installers = installers;
    }
    if (newAddress) {
      updateData.address = newAddress;
    }
    if (newCoordinators) {
      updateData.coordinator = newCoordinators;
    }

    updateData.status = InstallationStatus.PENDING;

    const updatedInstallation = await this.installationsRepository.update(
      id,
      updateData,
    );
    return updatedInstallation;
  }

  async statusChange(id: string, dto: StatusChangeDto) {
    const installation = await this.installationsRepository.getById(id);
    if (!installation)
      throw new NotFoundException(
        'Instalación no encontrada, id incorrecto o inexistente',
      );
    if (!allowedTransitions[installation.status]?.includes(dto.status)) {
      throw new BadRequestException(
        `Transición de estado no permitida: ${installation.status} -> ${dto.status}`,
      );
    }

    const updateData: Partial<Installation> = { ...dto };
    const now = new Date();

    if (dto.status === InstallationStatus.IN_PROCESS) {
      updateData.startedAt = now;
    }

    if (
      [InstallationStatus.CANCEL, InstallationStatus.FINISHED].includes(
        dto.status,
      )
    ) {
      updateData.endDate = now;
    }

    if (dto.status === InstallationStatus.IMAGES_REJECTED) {
      updateData.status = InstallationStatus.IN_PROCESS;
    }

    const result = await this.installationsRepository.update(id, updateData);
    if (!result)
      throw new InternalServerErrorException(
        'No se pudo actualizar el estado de la instalación',
      );

    if (result.status !== installation.status) {
      await this.eventsSwitch(result, dto.status);
    }

    return await this.installationsRepository.getById(id);
  }

  async sendToReview(id: string, files: Express.Multer.File[]) {
    const installation = await this.installationsRepository.getById(id);

    if (!installation)
      throw new NotFoundException('No se encontro la isntalción');

    if (installation.status !== InstallationStatus.IN_PROCESS) {
      throw new BadRequestException(
        `Transición de estado no permitida:
         ${installation.status} -> ${InstallationStatus.TO_REVIEW}`,
      );
    }

    const imagesUrls: string[] = await Promise.all(
      files.map(async (file) => {
        const fileUrl = await this.fileUploadService.uploadFile(file);
        await this.imageService.saveFile({
          url: fileUrl,
          mimetype: file.mimetype,
        });
        return fileUrl;
      }),
    );

    if (!imagesUrls.length)
      throw new ServiceUnavailableException(
        'Hubo un problema al subir las imagenes',
      );
    const result = await this.installationsRepository.update(id, {
      status: InstallationStatus.TO_REVIEW,
      images: imagesUrls,
      submittedForReviewAt: new Date(),
    });
    if (!result)
      throw new InternalServerErrorException('No se pudo cambiar el estado');

    if (installation.order.client?.length && installation.coordinator?.length) {
      await this.eventsSwitch(result, InstallationStatus.TO_REVIEW);
    }
    return result;
  }

  async remove(id: string) {
    const installation = await this.installationsRepository.getById(id);
    if (!installation)
      throw new NotFoundException(
        'Instalación no encontrada, id incorrecto o inexistente',
      );
    const result = await this.installationsRepository.softDelete(id);
    if (!result.affected)
      throw new InternalServerErrorException(
        'No se pudo eliminar la isntlación',
      );
    if (installation.order.id)
      await this.emitRecalculateOrderProgress({
        orderId: installation.order.id,
      });
    return new DeleteResponse('instalación', id);
  }

  private async eventsSwitch(result: Installation, status: InstallationStatus) {
    switch (status) {
      case InstallationStatus.IN_PROCESS:
        if (result.order && result.coordinator && result.address) {
          await this.emitGeneralUpdate(result);
        }
        break;
      case InstallationStatus.POSTPONED:
        if (result.coordinator && result.address) {
          await this.emitPostponedUpdate(result);
        }
        break;
      case InstallationStatus.IMAGES_REJECTED:
        if (result.installers && result.address) {
          await this.emitRejectedImagesUpdate(result);
        }
        break;
      case InstallationStatus.CANCEL:
        if (result.order?.client && result.installers) {
          await this.emitCancelledUpdate(result);
          await this.emitRecalculateOrderProgress({ orderId: result.order.id });
        }
        break;
      case InstallationStatus.TO_REVIEW:
        if (result.coordinator && result.address && result.images) {
          await this.emitToReviewUpdate(result);
        }
        break;
      case InstallationStatus.FINISHED:
        if (
          result.order?.client &&
          result.installers &&
          result.address &&
          result.images
        ) {
          await this.emitApprovedUpdate(result);
          await this.emitRecalculateOrderProgress({ orderId: result.order.id });
        }
        break;
      default:
        if (
          result.order?.client &&
          result.installers &&
          result.address &&
          result.images
        ) {
          await this.emitApprovedUpdate(result);
          await this.emitRecalculateOrderProgress({ orderId: result.order.id });
        }
    }
  }

  private async emitGeneralUpdate(result: Installation) {
    await this.eventEmitter.emitAsync(
      NotifyEvents.INSTALLATION_GENERAL_UPDATE,
      new InstallationGeneralUpdate(result),
    );
  }

  private async emitPostponedUpdate(result: Installation) {
    await this.eventEmitter.emitAsync(
      NotifyEvents.INSTALLATION_POSTPONED,
      new InstallationPostponedDto(result),
    );
  }

  private async emitApprovedUpdate(result: Installation) {
    await this.eventEmitter.emitAsync(
      NotifyEvents.INSTALLATION_APROVE,
      new InstallationApprovedDto(result),
    );
  }

  private async emitToReviewUpdate(result: Installation) {
    await this.eventEmitter.emitAsync(
      NotifyEvents.INSTALLATION_TO_REVIEW,
      new InstallationToReviewDto(result),
    );
  }

  private async emitCancelledUpdate(result: Installation) {
    await this.eventEmitter.emitAsync(
      NotifyEvents.INSTALLATION_CANCELLED,
      new InstallationCancelDto(result),
    );
  }

  private async emitRecalculateOrderProgress(data: RecalculateProgressDto) {
    await this.eventEmitter.emitAsync(OrderEvent.RECALCULATE, data);
  }

  private async emitRejectedImagesUpdate(data: Installation) {
    await this.eventEmitter.emitAsync(
      NotifyEvents.IMAGES_REJECTED,
      new ImagesRejectedEvent(data),
    );
  }

  private async getValidCoordinator({
    coordinatorsIds,
    coordinatorsEmails,
  }: {
    coordinatorsIds?: string[];
    coordinatorsEmails?: string[];
  }): Promise<UserRole[]> {
    if (!coordinatorsIds?.length && !coordinatorsEmails?.length) {
      throw new BadRequestException(
        'Debes indicar IDs o e-mails de coordinadores',
      );
    }

    const found = coordinatorsIds?.length
      ? await Promise.all(
          coordinatorsIds.map((id) =>
            this.userRoleService.getByIdWhenRole(id, RoleEnum.COORDINATOR),
          ),
        )
      : await Promise.all(
          (coordinatorsEmails ?? []).map((email) =>
            this.userRoleService.getByUserEmail(email, RoleEnum.COORDINATOR),
          ),
        );
    const coordinators = found.filter((u): u is UserRole => u !== null);
    if (!coordinators.length)
      throw new BadRequestException('No se encontraron los coordinadores');

    return coordinators;
  }

  private async getValidInstallers({
    installersIds,
    installersEmails,
  }: {
    installersIds?: string[];
    installersEmails?: string[];
  }): Promise<Installer[]> {
    if (!installersIds?.length && !installersEmails?.length) {
      throw new BadRequestException(
        'Debes indicar IDs o e-mails de instaladores',
      );
    }

    const found: Array<Installer | null> = installersIds?.length
      ? await Promise.all(
          installersIds.map((id) => this.installerService.findById(id)),
        )
      : await Promise.all(
          (installersEmails ?? []).map(
            (email) =>
              this.installerService.findByEmail(
                email,
                true,
              ) as Promise<Installer | null>,
          ),
        );

    const installers = found.filter((i): i is Installer => i !== null);

    if (!installers.length) {
      throw new BadRequestException('No se encontraron los instaladores');
    }

    const invalid = installers.find(
      (i) => i.status !== StatusInstaller.Approved,
    );
    if (invalid) {
      throw new HttpException(
        'Estás intentando asignar instaladores no aprobados',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return installers;
  }
}

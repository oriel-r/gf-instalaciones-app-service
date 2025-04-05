import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsRepository } from './notifications.repository';
import { UserRoleService } from '../user-role/user-role.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { NotifyEvents } from 'src/common/enums/notifications-events.enum';
import { InstallationGeneralUpdate } from './dto/installation-general-update.dto';
import { InstallationPostponedDto } from './dto/installation-postponed.dto';
import { InstallationApprovedDto } from './dto/installation-aproved.dto';
import { DeepPartial } from 'typeorm';
import { RoleEnum } from 'src/common/enums/user-role.enum';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly userRoleService: UserRoleService,
    private readonly eventEmitter: EventEmitter2
  ) {}

 
  async create(createNotificationDto: CreateNotificationDto) {
    const result = await this.notificationsRepository.create(createNotificationDto)
    return `This action adds a new notification ${result}`;
  }

  @OnEvent(NotifyEvents.INSTALLATION_GENERAL_UPDATE)
  async installationUpdate(data: InstallationGeneralUpdate) {
    return console.log(NotifyEvents.INSTALLATION_GENERAL_UPDATE, data)
  }

  @OnEvent(NotifyEvents.INSTALLATION_POSTPONED)
  async postponedInstallation (data: InstallationPostponedDto) {
    const {coordinatorId} = data
    try {
      const coordinator = await this.userRoleService.getByIdWhenRole(coordinatorId, RoleEnum.COORDINATOR)
      if(!coordinator) throw new BadRequestException('Coordinador incorrecto')
      const newNotification = await this.create({
        title: "La instalación se pospuso",
        message: `Que paso, donde paso, etc`,
        receivers: [coordinator]
      })
      return newNotification
    } catch (err) {
      return console.log(err)
    }

  }

  @OnEvent(NotifyEvents.INSTALLATION_TO_REVIEW)
  async installationToReview(createNotificationDto: CreateNotificationDto) {
    const result = await this.notificationsRepository.create(createNotificationDto)
    if(!result) throw new BadRequestException('Hubo un problema al enviar la notificaion')
      return result
  }

  @OnEvent(NotifyEvents.INSTALLATION_APROVE)
  async installationFinished(data: InstallationApprovedDto) {
    const {clientId, installers} = data
    try {
      const aClient = await this.userRoleService.getByIdWhenRole(clientId, RoleEnum.USER)
      if(!aClient) throw new BadRequestException('Cliente incorrecto')
      const newNotification = await this.create({
        title: "La instalación a finalizado!",
        message: `Se envian las fotos`,
        receivers: [aClient]
      })
      return newNotification
    } catch (err) {
      return console.log(err)
    }

  }

  async findAll() {
    const result = await this.notificationsRepository.getAll()
    return `This action adds a new notification ${result}`;
  }

  async findOne(id: string) {
    const result = await this.notificationsRepository.get(id)
    return `This action adds a new notification ${result}`;
  }

  async remove(id: string) {
    const result = await this.notificationsRepository.delete()
    return `This action adds a new notification ${result}`;
  }
}

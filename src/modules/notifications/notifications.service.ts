import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
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
import { EmailService } from '../email/email.service';
import { InstallationToReviewDto } from './dto/installation-to-review.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly userRoleService: UserRoleService,
    private readonly eventEmitter: EventEmitter2,
    private readonly emailService: EmailService
  ) {}

 
  async create(createNotificationDto: CreateNotificationDto) {

    const result = await this.notificationsRepository.create(createNotificationDto)
    return `This action adds a new notification ${result}`;
  }

  @OnEvent(NotifyEvents.INSTALLATION_GENERAL_UPDATE)
  async installationUpdate(data: InstallationGeneralUpdate) {
    const {clientId, coordinatorId, address } = data
    const {street, number, city} = address
    try {
      const client = await this.userRoleService.getByIdWhenRole(clientId, RoleEnum.USER)
      const coordinator = await this.userRoleService.getByIdWhenRole(coordinatorId, RoleEnum.COORDINATOR)
      if(!client || !coordinator ) throw new BadRequestException('No se encontro a alguno de los receptores')
        console.log(client, coordinator)
    /*  const emails = await this.emailService.sendEmail({
        to: [client.user.email, coordinator.user.email],
        subject: "Los instladores an llegado!",
        message: `La instalación con a realizarse en ${street} ${number} de la ciudad de ${city.name} (${city.province.name}) esta en proceso`
      })
      if (!emails) throw new ServiceUnavailableException('No se pudo enviar los emails') */
      const newNotification = await this.create({
        title: "Los instladores an llegado!",
        message: `La instalación con a realizarse en ${street} ${number} de la ciudad de ${city.name} (${city.province.name}) esta en proceso`,
        receivers: [client, coordinator]
      })
      return newNotification
    } catch (err) {
      return console.log(err)
    }
  }

  @OnEvent(NotifyEvents.INSTALLATION_POSTPONED)
  async postponedInstallation (data: InstallationPostponedDto) {
    const {coordinatorId, address} = data
    try {
      const coordinator = await this.userRoleService.getByIdWhenRole(coordinatorId, RoleEnum.COORDINATOR)
      if(!coordinator) throw new BadRequestException('Coordinador incorrecto')
      console.log(coordinator)
     /*      const emails = await this.emailService.sendEmail({
        to: [coordinator.user.email],
        subject: "La instalación se pospuso",
        message: `La instalación a realizarse en ${address.street} ${address.number} de ciudad de ${address.city.name} (${address.city.province.name}) se pospuso`
      })
      if (!emails) throw new ServiceUnavailableException('No se pudo enviar los emails') */
      const newNotification = await this.create({
        title: "La instalación se pospuso",
        message: `La instalación a realizarse en ${address.street} ${address.number} de ciudad de ${address.city.name} (${address.city.province.name}) se pospuso`,
        receivers: [coordinator]
      })
      return newNotification
    } catch (err) {
      return console.log(err)
    }

  }

  @OnEvent(NotifyEvents.INSTALLATION_TO_REVIEW)
  async installationToReview(data: InstallationToReviewDto) {
        const {clientId, coordinatorId, address, images} = data

        const aClient = await this.userRoleService.getByIdWhenRole(clientId, RoleEnum.USER)
        const aCoordinator = await this.userRoleService.getByIdWhenRole(coordinatorId, RoleEnum.COORDINATOR)

        if(!aClient || !aCoordinator) throw new HttpException('Coordinador o cliente no encontrados', HttpStatus.UNPROCESSABLE_ENTITY)
        
       /* const emailForClient = await this.emailService.sendEmail({
          to: aClient.user.email,
          subject: 'Ya casí!',
          html: `<h2>Estamos verificando tu intalación en: </h2>
                  <p>Calle: ${address.street}, ${address.number}</p>
                  <p>Ciudad: ${address.city}</p>
                  <p>Provincia: ${address.city.province}</p>
                  `
        })
        
        const emailForCoord = await this.emailService.sendEmail({
          to: aCoordinator.user.email,
          subject: `Verifica la istalación en ${address.street} ${address.number}` ,
          message: 'Las imagenes ya estan disponibles en laplataforma'
        }) */
        const newNotification = await this.create({
        title: "La instalación esta pendiente a revisar",
        message: `La instalación a realizarse en ${address.street} ${address.number} de ciudad de ${address.city.name} (${address.city.province.name}) esta pendiente de reivsar`,
        receivers: [aCoordinator, aClient]
      })
  }

  @OnEvent(NotifyEvents.INSTALLATION_APROVE)
  async installationFinished(data: InstallationApprovedDto) {
    const {clientId, installers, address} = data
    try {
      const aClient = await this.userRoleService.getByIdWhenRole(clientId, RoleEnum.USER)
      console.log(aClient)
      console.log(installers)
      const rawInstallersUsers = await Promise.all(
          installers.map(inst => this.userRoleService.getByInstallerId(inst.id))
        )

      const installersUsers = rawInstallersUsers.filter(user => user !== null);
      if(!aClient) throw new BadRequestException('Cliente no encontrado')
      if(!installersUsers || !installersUsers.length ) throw new BadRequestException('Cliente no encontrado')
      console.log(installersUsers)
      const installersEmails = installersUsers.map(inst => inst.user.email)
      const emails = await this.emailService.sendEmail({
        to: [aClient.user.email, ...installersEmails],
        subject: 'La instalación a finalizado!',
        message: `La instalación realizada en ${address.street} ${address.number} de ciudad de ${address.city.name} (${address.city.province.name}) se finalizo con exitosamente`
      })
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

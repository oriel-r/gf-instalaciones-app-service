import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
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
import { InstallationCreatedEvent } from './dto/installation.created.event';
import { OrderCompletedEvent } from './dto/order.completed.event';
import { OrderCreatedEvent } from './dto/order.created.event';
import { ImagesRejectedEvent } from './dto/images-rejected-event.dto';
import { UserRole } from '../user-role/entities/user-role.entity';
import { OrdersRepository } from '../operations/orders/orders.repository';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly userRoleService: UserRoleService,
    private readonly eventEmitter: EventEmitter2,
    private readonly emailService: EmailService,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  private readonly BATCH_SIZE = 5;

  async create(createNotificationDto: CreateNotificationDto) {
    const result = await this.notificationsRepository.create(
      createNotificationDto,
    );
    return `This action adds a new notification ${result}`;
  }

  @OnEvent(NotifyEvents.INSTALLATION_CREATED)
  async onInstallationCreated(data: InstallationCreatedEvent) {
    const { installersIds, coordinatorsIds, address } = data;

    try {
      const coordinators = await this.getValidCoordinator({
        coordinatorsIds: coordinatorsIds,
        coordinatorsEmails: undefined,
      });

      const installers = await Promise.all(
        installersIds!.map(
          async (id) => await this.userRoleService.getByInstallerId(id),
        ),
      );

      const filterInstallers = installers.filter((i) => i !== null);

      const receivers = [...coordinators, ...filterInstallers];

      if (receivers.length === 0) return
      if(!address) {
        throw new BadRequestException(
          'No se encontro la dirección'
        )
      }

      const emails = await this.emailService.sendEmail({
        to: receivers.map((r) => r.user.email),
        subject: 'Nueva instalación asignada',
        html: `<h2>Se ha creado una nueva instalación</h2>
        <p><strong>Dirección:</strong> ${address.street} ${address.number}, ${address.city.name}, ${address.city.province.name}</p>
        <p>Ya puedes revisar los detalles en la plataforma.</p>`,
      });

      if (!emails)
        throw new ServiceUnavailableException('No se pudo enviar los emails');

      return await this.create({
        title: 'Nueva instalación asignada',
        message: `Se ha creado una instalación en ${address.street} ${address.number}, ${address.city.name} (${address.city.province.name})`,
        receivers,
      });
    } catch (err) {
      console.log(err);
    }
  }

  @OnEvent(NotifyEvents.ORDER_CREATED)
  async onOrderCreated(data: OrderCreatedEvent) {
    const { clientsIds, orderNumber } = data;

    try {
      const clients = await this.getValidClients({
        clientsIds,
        clientsEmails: undefined,
      });
      const emails = await this.emailService.sendEmail({
        to: clients.map((c) => c.user.email),
        subject: 'Nueva orden creada',
        html: `<h2>Se ha creado la orden ${orderNumber}</h2>`,
      });

      if (!emails)
        throw new ServiceUnavailableException('No se pudo enviar los emails');

      return await this.create({
        title: 'Orden creada',
        message: `Se ha creado la orden ${orderNumber}`,
        receivers: clients,
      });
    } catch (err) {
      console.log(err);
    }
  }

  @OnEvent(NotifyEvents.ORDER_COMPLETED)
  async onOrderCompleted(data: OrderCompletedEvent) {
    const { orderNumber, clientId, date } = data;

    try {
      const client = await this.getValidClients({
        clientsIds: clientId,
        clientsEmails: undefined,
      });
      if (!client) throw new BadRequestException('No se encontró el cliente');

      const emailSent = await this.emailService.sendEmail({
        to: [...client.map((c) => c.user.email)],
        subject: 'Tu orden ha sido finalizada',
        html: `<h2>¡Orden completada!</h2>
        <p>Tu orden con ID <strong>${orderNumber}</strong> ha sido finalizada con éxito.</p>`,
      });

      if (!emailSent)
        throw new ServiceUnavailableException('No se pudo enviar el email');

      return await this.create({
        title: 'Orden finalizada',
        message: `Tu orden ${orderNumber} ha sido completada con éxito`,
        receivers: [...client],
      });
    } catch (err) {
      console.log(err);
    }
  }

  @OnEvent(NotifyEvents.IMAGES_REJECTED)
  async onImagesRejected(data: ImagesRejectedEvent) {
    const { installersIds, address, installationId } = data;

    try {
      const installers = await Promise.all(
        installersIds!.map(
          async (id) => await this.userRoleService.getByInstallerId(id),
        ),
      );

      const filterInstallers = installers.filter((i) => i !== null);

      if(!address) {
        throw new BadRequestException(
          'No se encontro la dirección al enviar el mail'
        )
      }

      const emails = await this.emailService.sendEmail({
        to: filterInstallers.map((inst) => inst.user.email),
        subject: 'Imágenes rechazadas',
        html: `<h2>Rechazo de imágenes</h2>
        <p>Las imágenes de la instalación en:</p>
          <p><strong>Calle:</strong> ${address.street} ${address.number}</p>
          <p><strong>Ciudad:</strong> ${address.city.name}</p>
          <p><strong>Provincia:</strong> ${address.city.province.name}</p>
          <p>Fueron rechazadas, comunicate con el coordinador</p>`,
      });

      if (!emails)
        throw new ServiceUnavailableException('No se pudo enviar los emails');

      return await this.create({
        title: 'Imágenes rechazadas',
        message: `Las imágenes de la instalación ${installationId} fueron rechazadas`,
        receivers: filterInstallers,
      });
    } catch (err) {
      console.log(err);
    }
  }

  @OnEvent(NotifyEvents.INSTALLATION_GENERAL_UPDATE)
  async installationUpdate(data: InstallationGeneralUpdate) {
    const { clientId, coordinatorId, address } = data;
    
    if(!address) {
        throw new BadRequestException(
          'No se encontro la dirección al enviar el mail'
        )
      }
    
    const { street, number, city } = address;
    try {
      const client = await this.getValidClients({
        clientsIds: clientId,
        clientsEmails: undefined,
      });
      const coordinator = await this.getValidCoordinator({
        coordinatorsIds: coordinatorId,
        coordinatorsEmails: undefined,
      });
      if (!client.length || !coordinator)
        throw new BadRequestException(
          'No se encontro a alguno de los receptores',
        );
      const emails = await this.emailService.sendEmail({
        to: [
          ...client.map((client) => client.user.email),
          ...coordinator.map((coordinator) => coordinator.user.email),
        ],
        subject: '¡Los instaladores ya llegaron!',
        html: `<h2>Tu instalación está en:</h2>
          <p><strong>Calle:</strong> ${address.street} ${address.number}</p>
          <p><strong>Ciudad:</strong> ${address.city.name}</p>
          <p><strong>Provincia:</strong> ${address.city.province.name}</p>
          <p>Esta en proceso, los instaladores estan trabajando en ella.</p>`,
      });
      if (!emails)
        throw new ServiceUnavailableException('No se pudo enviar los emails');
      const newNotification = await this.create({
        title: 'Los instladores an llegado!',
        message: `La instalación con a realizarse en ${street} ${number} de la ciudad de ${city.name} (${city.province.name}) esta en proceso`,
        receivers: [...client, ...coordinator],
      });
      return newNotification;
    } catch (err) {
      return console.log(err);
    }
  }

  @OnEvent(NotifyEvents.INSTALLATION_POSTPONED)
  async postponedInstallation(data: InstallationPostponedDto) {
    const { coordinatorId, address } = data;

    if(!address) {
      throw new BadRequestException(
        'No se econtro la dirección'
      )
    }

    try {
      const coordinator = await this.getValidCoordinator({
        coordinatorsIds: coordinatorId,
        coordinatorsEmails: undefined,
      });
      if (!coordinator.length)
        throw new BadRequestException('Coordinador incorrecto');
      const emails = await this.emailService.sendEmail({
        to: [...coordinator.map((coordinator) => coordinator.user.email)],
        subject: 'La instalación fue pospuesta',
        html: `<h2>La instalación prevista en ${address.street} ${address.number}, ${address.city.name} (${address.city.province.name}) ha sido pospuesta.</h2>`,
      });
      if (!emails)
        throw new ServiceUnavailableException('No se pudo enviar los emails');
      const newNotification = await this.create({
        title: 'La instalación se pospuso',
        message: `La instalación a realizarse en ${address.street} ${address.number} de ciudad de ${address.city.name} (${address.city.province.name}) se pospuso`,
        receivers: [...coordinator],
      });
      return newNotification;
    } catch (err) {
      return console.log(err);
    }
  }

  @OnEvent(NotifyEvents.INSTALLATION_TO_REVIEW)
  async installationToReview(data: InstallationToReviewDto) {
    const { clientId, coordinatorId, address, images } = data;

    const aClient = await this.getValidClients({
      clientsIds: clientId,
      clientsEmails: undefined,
    });
    const aCoordinator = await this.getValidCoordinator({
      coordinatorsIds: coordinatorId,
      coordinatorsEmails: undefined,
    });

    if (!aClient.length || !aCoordinator.length)
      throw new HttpException(
        'Coordinador o cliente no encontrados',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    if(!address) {
      throw new BadRequestException(
        'No se econtro la dirección'
      )
    }


    const emailForClient = await this.emailService.sendEmail({
      to: [...aClient.map((client) => client.user.email)],
      subject: `¡Estamos verificando tu instalación!`,
      html: `<h2>Se completó la instalación en:</h2>
            <p><strong>Calle:</strong> ${address.street} ${address.number}</p>
            <p><strong>Ciudad:</strong> ${address.city.name}</p>
            <p><strong>Provincia:</strong> ${address.city.province.name}</p>
            <p>Estamos verificando que todo haya salido bien. En breve recibirás las imágenes.</p>`,
    });

    const emailForCoord = await this.emailService.sendEmail({
      to: [...aCoordinator.map((coordinator) => coordinator.user.email)],
      subject: `Verificá la instalación en ${address.street} ${address.number}`,
      html: this.sendEmailtToCoordinatorForReview(
        images as string[],
        address.street,
        address.number,
      ),
    });
    const newNotification = await this.create({
      title: 'La instalación esta pendiente a revisar',
      message: `La instalación a realizarse en ${address.street} ${address.number} de ciudad de ${address.city.name} (${address.city.province.name}) esta pendiente de reivsar`,
      receivers: [...aCoordinator, ...aClient],
    });
  }

  @OnEvent(NotifyEvents.INSTALLATION_APROVE)
  async installationFinished(data: InstallationApprovedDto) {
    const { clientId, installers, address, images, orderId } = data;
    try {
      const order = await this.ordersRepository.getById(orderId);
      const clients = await this.getValidClients({
        clientsIds: clientId,
        clientsEmails: undefined,
      });
      const rawInstallersUsers = await Promise.all(
        installers.map((inst) =>
          this.userRoleService.getByInstallerId(inst.id),
        ),
      );

      const installersUsers = rawInstallersUsers.filter(
        (user) => user !== null,
      );
      if (!clients.length)
        throw new BadRequestException('Cliente no encontrado');
      if (!installersUsers || !installersUsers.length)
        throw new BadRequestException('Cliente no encontrado');
      if (!order) throw new BadRequestException('No se encontro la orden');

      const finished = order.installations.filter(
        (i) => i.status === InstallationStatus.FINISHED,
      );
      const pending = finished.slice(order.notifiedInstallations || 0);

      let html: string;
      let subject: string;

      if (
        order.installations.length > this.BATCH_SIZE &&
        pending.length < this.BATCH_SIZE &&
        finished.length !== order.installations.length
      ) {
        await this.ordersRepository.update(orderId, {
          notifiedInstallations: finished.length,
        });
        return;
      }

      if (
        order.installations.length > this.BATCH_SIZE &&
        pending.length >= this.BATCH_SIZE
      ) {
        const addresses = pending.map(
          (inst) => `${inst.address!.street} ${inst.address!.number}`,
        );
        html = `<h2>Se finalizaron las instalaciones en:</h2><ul>${addresses.map((a) => `<li>${a}</li>`).join('')}</ul>`;
        subject = 'Instalaciones finalizadas';
      } else {
        html = this.generateSimpleInstallationEmail(images as string[]);
        subject = 'La instalación a finalizado!';
      }

      const installersEmails = installersUsers.map((inst) => inst.user.email);
      await this.emailService.sendEmail({
        to: [
          ...clients.map((client) => client.user.email),
          ...installersEmails,
        ],
        subject,
        html,
      });

      await this.create({
        title: subject,
        message: subject,
        receivers: [...clients, ...installersUsers],
      });

      await this.ordersRepository.update(orderId, {
        notifiedInstallations: finished.length,
      });
    } catch (err) {
      return console.log(err);
    }
  }

  async findAll() {
    const result = await this.notificationsRepository.getAll();
    return `This action adds a new notification ${result}`;
  }

  async findOne(id: string) {
    const result = await this.notificationsRepository.get(id);
    return `This action adds a new notification ${result}`;
  }

  async remove(id: string) {
    const result = await this.notificationsRepository.delete();
    return `This action adds a new notification ${result}`;
  }

  private async getValidClients({
    clientsIds,
    clientsEmails,
  }: Record<'clientsIds' | 'clientsEmails', string[] | undefined>) {
    let found: Array<UserRole | null> = [];

    if (clientsIds)
      found = await Promise.all(
        clientsIds.map((id) =>
          this.userRoleService.getByIdWhenRole(id, RoleEnum.USER),
        ),
      );
    else if (clientsEmails) {
      found = await Promise.all(
        clientsEmails.map((email) =>
          this.userRoleService.getByUserEmail(email, RoleEnum.USER),
        ),
      );
    }

    const clients = found.filter((client) => client !== null);
    if (clients.length === 0) {
      throw new BadRequestException('No se encontraron los instaladores');
    }

    return clients;
  }

  private async getValidCoordinator({
    coordinatorsIds,
    coordinatorsEmails,
  }: Record<
    'coordinatorsIds' | 'coordinatorsEmails',
    string[] | undefined
  >): Promise<UserRole[]> {
    let found: Array<UserRole | null> | void[] = [];

    if(coordinatorsIds && !coordinatorsIds.length ) return []
    
    if (coordinatorsIds) {
      found = await Promise.all(
        coordinatorsIds.map((id) =>
          this.userRoleService.getByIdWhenRole(id, RoleEnum.COORDINATOR),
        ),
      );
    }
    else if (coordinatorsEmails) {
      found = await Promise.all(
        coordinatorsEmails.map((email) =>
          this.userRoleService.getByUserEmail(email, RoleEnum.COORDINATOR),
        ),
      );
    }


    const coordinators = found.filter((i) => i != null);
    if (coordinators.length === 0) {
      throw new BadRequestException('No se encontraron los coordinadores');
    }

    return coordinators;
  }

  private generateSimpleInstallationEmail(imageUrls: string[]) {
    const imagesHtml = imageUrls
      .map(
        (url) => `
        <div style="margin: 16px 0;">
          <img src="${url}" alt="Imagen de la instalación" style="max-width: 100%; border-radius: 8px;" />
          <p style="margin-top: 4px;">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1a73e8; text-decoration: none;">
              Ver o descargar imagen
            </a>
          </p>
        </div>
      `,
      )
      .join('');

    return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2>¡Tu instalación ha sido completada!</h2>
      <p>Estas son las fotos del resultado final:</p>
      ${imagesHtml}
      <p style="margin-top: 24px;">Muchas gracias por confiar en nosotros.</p>
    </div>
  `;
  }

  private sendEmailtToCoordinatorForReview(
    imageUrls: string[],
    stret: string,
    number: string,
  ) {
    const imagesHtml = imageUrls
      .map(
        (url) => `
        <div style="margin: 16px 0;">
          <img src="${url}" alt="Imagen de la instalación" style="max-width: 100%; border-radius: 8px;" />
          <p style="margin-top: 4px;">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1a73e8; text-decoration: none;">
              Ver o descargar imagen
            </a>
          </p>
        </div>
      `,
      )
      .join('');

    return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2>La instalación en ${stret} ${number} esta completa!</h2>
      <p>Estas son la imagenes tomadas por los instaladores, ingresa a la plataforma para marcar como finalizada la instalación.</p>
      ${imagesHtml}
      <p style="margin-top: 24px;">Muchas gracias por confiar en nosotros.</p>
    </div>
  `;
  }
}

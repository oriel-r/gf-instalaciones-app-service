import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { OrdersRepository } from './orders.repository';
import { InstallationsService } from '../installations/installations.service';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { DeepPartial, DeleteResult } from 'typeorm';
import { InstallationDataRequesDto } from './dto/installation-data.request.dto';
import { calculateProgressFraction } from 'src/common/helpers/calculate-progress-fraction';
import { Order } from './entities/order.entity';
import { calculateProgress } from 'src/common/helpers/calculate-progress';
import { GetOrderResponseDto } from './dto/get-order-response.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserRoleService } from 'src/modules/user-role/user-role.service';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { OrderQueryOptionsDto } from './dto/orders-query-options.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { InstallationQueryOptionsDto } from '../installations/dto/installation-query-options.dto';
import { OrderEvent } from 'src/common/enums/orders-event.enum';
import { RecalculateProgressDto } from './dto/recalculate-progress.dto';
import { RolePayload } from 'src/common/entities/role-payload.dto';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly installationsService: InstallationsService,
    private readonly eventEmiiter: EventEmitter2,
    private readonly userRoleService: UserRoleService
  ) {}
  
  async create(createOrderDto: CreateOrderRequestDto) {
    const { clientsIds, clientsEmails, ...orderData } = createOrderDto;
  
    const existOrder = await this.ordersRepository.getByNumber(orderData.orderNumber);
    const clients = clientsIds ? await this.getValidClients({clientsIds: clientsIds, clientsEmails: undefined}) : await this.getValidClients({clientsIds: undefined, clientsEmails: clientsEmails})
    
    if (existOrder) throw new BadRequestException('Ya existe una orden con este número de referencia')  
    
    if(!clients.length) throw new BadRequestException('Cliente no encontrado')

    const newOrder = await this.ordersRepository.create({...orderData, client: clients});
  
    if(!newOrder) throw new InternalServerErrorException('Hubo un problema al crear la orden')
  
    return await this.findOne(newOrder.id)
  }

  async addInstallations(data: InstallationDataRequesDto | InstallationDataRequesDto[], id?: string) {
    let order: Order | null = null

    if(!id && Array.isArray(data) && data.every(item => item.orderNumber)) return this.addinstallationsFromBatch(data)

   return this.addInstallation(id as string, data as unknown as InstallationDataRequesDto)
  } 

  async findAll(query: OrderQueryOptionsDto, roles: any[]) {
    const isUser = roles.every(role => role.name !== RoleEnum.ADMIN)
    const clientId = isUser ? roles[0].id : null

    const orders = await this.ordersRepository.get(query, clientId)

      const result: PaginationResult<GetOrderResponseDto> = [orders[0].map(order => new GetOrderResponseDto(order)),orders[1]]
      return result
  }

  async findOne(id: string, roles?: RolePayload[]) {
    const isUser = roles && roles.every(role => role.name !== RoleEnum.ADMIN)
    const clientId = isUser ? roles[0].id : null

    const order = await this.ordersRepository.getById(id)
    if(!order) throw new NotFoundException('No se encontro la orden')
      return order
  }

  async getInstallationsFromId (id: string, query: InstallationQueryOptionsDto, roles?: RolePayload[]) {
        const isUser = roles && roles.every(role => role.name !== RoleEnum.ADMIN)
    const clientId = isUser ? roles[0].id : null

    const order = await this.ordersRepository.getById(id)
    if(!order) throw new NotFoundException('No se encontro la orden')
    const installations = await this.installationsService.filterFromOrder(id, query)
      return installations
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.ordersRepository.getByNumber(orderNumber)
    if(!order) throw new NotFoundException('No se encontro la orden')
      return order
  }

  async update(id: string, updateOrderDto: DeepPartial<Order>) {
    const order = await this.findOne(id)
    if(!order) throw new NotFoundException('No se encontro la orden')
    if(updateOrderDto.completed && order.progress < 100) {
      throw new BadRequestException(
        `No se puede marcar la orden ${order.orderNumber} como completada, quedan instalciones a Finalizar`
      )
    }
      return this.ordersRepository.update(id, updateOrderDto)
  }

  async remove(id: string) {
    const order = await this.findOne(id)
    let result: DeleteResult | null = null
    if(order) {
      result = await this.ordersRepository.softDelete(id)
    }
    if(!result) throw new HttpException('Hubo un problema al borrar la orden', HttpStatus.INTERNAL_SERVER_ERROR)
      return new DeleteResponse('orden', id) 
  }

  private async addinstallationsFromBatch(data: InstallationDataRequesDto[]) {
     const formattedData: Array<{ order: Order; installation: any }> = [];
    for (const item of data) {
      const { orderNumber, ...installationData } = item;
      const order = await this.findByOrderNumber(orderNumber!);
      formattedData.push({ order, installation: installationData });
    }

    const creationPromises = formattedData.map(item =>
      this.installationsService
        .createFromOrder(item)
        .then(response =>
          ({
          status: 'fulfilled' as const,
          referenceId: response!.referenceId,
          orderId: item.order.id
        }))
        .catch(err => ({
          status: 'reject' as const,
          referenceId: item.installation.referenceId,
          reason: err['response']['message'],
        }))
    );

    const newInstallationsResult = await Promise.all(creationPromises);

    const ordersIds = newInstallationsResult.reduce((acc: string[], item) => {
      if(item['status'] === 'fulfilled') acc.push(item.orderId)
        return acc
      }, [])

    this.updateProgress({orderId: ordersIds})

    return newInstallationsResult;
  }

  private async addInstallation(id: string, data: InstallationDataRequesDto) {

    const order = await this.findOne(id as string)
    if (!order) throw new NotFoundException('orden no encontrada o numero invalido');
    console.log({addInstallationFunc: data})
    const newInstallation = await this.installationsService.createFromOrder({order, installation: data})
    if(!newInstallation) throw new InternalServerErrorException('No se crearon las instalaciónes')
    const fraction = calculateProgressFraction((await this.findOne(id as string)).installations)
    await this.update(order.id, {installationsFinished: fraction})

    return newInstallation
  }

  private async getValidClients({clientsIds, clientsEmails}: Record<'clientsIds' | 'clientsEmails' , string[] | undefined>) {
   let found: Array<UserRole | null> = []

  console.log({getClients:{ids: clientsIds, emails: clientsEmails}})

  if(clientsIds)
    found = await Promise.all(
    clientsIds.map(async (id) => {
     const pepe = await this.userRoleService.getByIdWhenRole(id, RoleEnum.USER)
     console.log({pepe: pepe})
     return pepe
    })
  ); else if(clientsEmails) {
    found = await Promise.all(
      clientsEmails.map(async (email) => await this.userRoleService.getByUserEmail(email, RoleEnum.USER))
    )
  }

  console.log({found:{clients: found}})

  const clients = found.filter((UserRole) => UserRole != null);
  if (clients.length === 0) {
    throw new BadRequestException('No se encontraron clientes');
  }

    return clients
  }

  @OnEvent(OrderEvent.RECALCULATE)
  async updateProgress({ orderId }: RecalculateProgressDto) {

    const isArray = Array.isArray(orderId)

    if(!isArray) {

      const installations = (await this.findOne(orderId)).installations
      const progress = calculateProgress(installations)
      const installationsFinished = calculateProgressFraction(installations)
  
      return await this.update(orderId, {progress, installationsFinished})
    }

    const updatePromises = orderId.map( async (order) => {
        const installations = (await this.findOne(order)).installations
        const progress = calculateProgress(installations)
        const installationsFinished = calculateProgressFraction(installations)
        this.update(order, {progress, installationsFinished})
        
      })

      return await Promise.all(updatePromises)      
      
    }
  }
import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { OrdersRepository } from './orders.repository';
import { InstallationsService } from '../installations/installations.service';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { DeepPartial, DeleteResult } from 'typeorm';
import { InstallationDataRequesDto } from './dto/installation-data.request.dto';
import { calculateProgressFraction } from 'src/common/helpers/calculate-progress-fraction';
import { Order } from './entities/order.entity';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';
import { calculateProgress } from 'src/common/helpers/calculate-progress';
import { UpdateInstallationStatus } from './dto/update-installation-status.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserRoleService } from 'src/modules/user-role/user-role.service';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { OrderQueryOptionsDto } from './dto/orders-query-options.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { InstallationQueryOptionsDto } from '../installations/dto/installation-query-options.dto';
import { NotifyEvents } from 'src/common/enums/notifications-events.enum';
import { InstallationGeneralUpdate } from 'src/modules/notifications/dto/installation-general-update.dto';
import { InstallationPostponedDto } from 'src/modules/notifications/dto/installation-postponed.dto';
import { InstallationApprovedDto } from 'src/modules/notifications/dto/installation-aproved.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly installationsService: InstallationsService,
    private readonly eventEmiiter: EventEmitter2,
    private readonly userRoleService: UserRoleService
  ) {}
  
  async create(createOrderDto: CreateOrderRequestDto) {
    const { clientId, ...orderData } = createOrderDto;
  
    const existOrder = await this.ordersRepository.getByNumber(orderData.orderNumber);
    if (existOrder) throw new BadRequestException('Ya existe una orden con este número de referencia')
  
    const client = await this.userRoleService.getByIdWhenRole(clientId, RoleEnum.USER)
    
    if(!client) throw new BadRequestException('Cliente no encontrado')

    const newOrder = await this.ordersRepository.create({...orderData, client: client});
  
    if(!newOrder) throw new InternalServerErrorException('Hubo un problema al crear la orden')
  
    return newOrder
  }

  async addInstallations(id: string, data: InstallationDataRequesDto | InstallationDataRequesDto[]) {
    const order = await this.findOne(id);
    const installations = Array.isArray(data) ? data : [data];
      
    if (!order) throw new NotFoundException('orden no encontrada o numero invalido');
    const newInstallations = await this.installationsService.createFromOrder({order, installations})
    if(!newInstallations) throw new InternalServerErrorException('No se crearon las instalaciónes')
    const fraction = calculateProgressFraction((await this.findOne(id)).installations)
    await this.update(order.id, {installationsFinished: fraction})

    return newInstallations
  } 

  async findAll(query: OrderQueryOptionsDto) {
    const orders = await this.ordersRepository.get(query)

      const result: PaginationResult<GetOrderResponseDto> = [orders[0].map(order => new GetOrderResponseDto(order)),orders[1]]
      return result
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.getById(id)
    if(!order) throw new NotFoundException('No se encontro la orden')
      return order
  }

  async getInstallationsFromId (id: string, query: InstallationQueryOptionsDto) {
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

  @OnEvent(NotifyEvents.INSTALLATION_APROVE)
  async updateProgress({ orderId }: InstallationApprovedDto) {
    console.log(orderId)
    const installations = (await this.findOne(orderId)).installations
    console.log(installations)
    const progress = calculateProgress(installations)
    const installationsFinished = calculateProgressFraction(installations)

    return await this.update(orderId, {progress, installationsFinished})
  }
}

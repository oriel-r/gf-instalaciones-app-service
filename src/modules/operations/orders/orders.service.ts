import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';
import { InstalationsService } from '../instalations/instalations.service';
import { Instalation } from '../instalations/entities/instalation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { DeepPartial, DeleteResult } from 'typeorm';
import { InstalationDataRequesDto } from './dto/instalation-data.request.dto';
import { calculateProgressFraction } from 'src/common/helpers/calculate-progress-fraction';
import { Order } from './entities/order.entity';
import { InstalationStatus } from 'src/common/enums/instalations-status.enum';
import { calculateProgress } from 'src/common/helpers/calculate-progress';
import { UpdateInstalationStatus } from './dto/update-instalation.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly instalationsService: InstalationsService
  ) {}
  
  async create(createOrderDto: CreateOrderRequestDto) {
    const { instalations, ...orderData } = createOrderDto;
  
    const existOrder = await this.ordersRepository.getByNumber(orderData.orderNumber);
    if (existOrder) throw new BadRequestException('Ya existe una orden con este número de referencia')
  
    const newOrder = await this.ordersRepository.create(orderData);
  
    if(!newOrder) throw new InternalServerErrorException('Hubo un problema al crear la orden')
  
    return newOrder
  }

  async addInstalations(id: string, data: InstalationDataRequesDto | InstalationDataRequesDto[]) {
    const order = await this.findOne(id);
    const instalations = Array.isArray(data) ? data : [data];
    let fractioningOfInstalations: string = ''

    if (!order) throw new NotFoundException('orden no encontrada o numero invalido');
    const newInstalations = await this.instalationsService.createFromOrder({order, instalations})
    if(!newInstalations || newInstalations.length === 0) throw new InternalServerErrorException    
    const fraction = calculateProgressFraction((await this.findOne(id)).instalations)
    return await this.update(order.id, {instalationsFinished: fraction})

  }
  
  async updateInstalationStatus(orderId: string, instalationId: string, status: UpdateInstalationStatus) {
    const order = await this.findOne(orderId)
    const instalation = order.instalations.find((instalation) => instalation.id === instalationId)
    if(!instalation) throw new NotFoundException('Instalación no encontrada o id invalido')
    
    const instalationWithChanges = await this.instalationsService.update(instalation.id, status)

    if(instalationWithChanges && instalationWithChanges.status !== InstalationStatus.FINISHED) return instalationWithChanges

    await this.updateProgress(orderId)

    return instalationWithChanges
    }


  async instalationToReview(id: string, data) {
    // traer instalación

    // subiir imagenes

    // actualizaar instalación con los links

    // retornar instalacion con links
  }

  async findAll() {
    const orders = await this.ordersRepository.get()
    if(!orders.length) throw new NotFoundException('No se encontraron ordenes')
      return orders
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.getById(id)
    if(!order) throw new NotFoundException('No se encontro la orden')
      return order
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.ordersRepository.getByNumber(orderNumber)
    if(!order) throw new NotFoundException('No se encontro la orden')
      return order
  }

  async update(id: string, updateOrderDto: DeepPartial<Order>) {
    const order = await this.findOne(id)
    if(order) return this.ordersRepository.update(id, updateOrderDto)
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

  private async updateProgress(id: string) {
    const instalations = (await this.findOne(id)).instalations
    const progress = calculateProgress(instalations)
    const instalationsFinished = calculateProgressFraction(instalations)

    return await this.update(id, {progress, instalationsFinished})
  }
}

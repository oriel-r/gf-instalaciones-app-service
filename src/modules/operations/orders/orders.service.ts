import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';
import { InstalationsService } from '../instalations/instalations.service';
import { Instalation } from '../instalations/entities/instalation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { DeleteResult } from 'typeorm';
import { InstalationDataRequesDto } from './dto/instalation-data.request.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly instalarionsService: InstalationsService
  ) {}
  
  async create(createOrderDto: CreateOrderRequestDto) {
    const { instalations, ...orderData } = createOrderDto;
  
    const existOrder = await this.ordersRepository.getByNumber(orderData.orderNumber);
    if (existOrder) throw new BadRequestException('Ya existe una orden con este número de referencia')
  
    const newOrder = await this.ordersRepository.create(orderData);
  
    let newInstalations: Instalation[] = [];
    if (instalations && instalations.length > 0) {
      newInstalations = await Promise.all(
        instalations.map(instalation =>
          this.instalarionsService.createFromOrder({
            ...instalation,
            order: newOrder,
          })
        )
      );
    }
  
    return await this.findByOrderNumber(orderData.orderNumber);
  }

  async addInstalations(orderNumber: string, data: InstalationDataRequesDto | InstalationDataRequesDto[]) {
    const order = await this.findByOrderNumber(orderNumber);
    if (!order) throw new NotFoundException('orden no encontrada o numero invalido');
  
    // Forzamos a array
    const dataArray = Array.isArray(data) ? data : [data];
  
    return await Promise.all(
      dataArray.map((instalation) =>
        this.instalarionsService.createFromOrder({
          ...instalation,
          order
        })
      )
    );
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
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
}

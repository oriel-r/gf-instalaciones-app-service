import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';
import { InstalationsService } from '../instalations/instalations.service';
import { CreateInstalationDto } from '../instalations/dto/create-instalation.dto';
import { Instalation } from '../instalations/entities/instalation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { DeleteResult } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly instalarionsService: InstalationsService
  ) {}
  
  async create(createOrderDto: CreateOrderDto) {
    const { instalations, ...orderData } = createOrderDto;
  
    const existOrder = await this.ordersRepository.getByNumber(orderData.orderNumber);
    if (existOrder) throw new BadRequestException('Ya existe una orden con este número de referencia')
  
    const newOrder = await this.ordersRepository.create(orderData);
  
    let newInstalations: Instalation[] = [];
    if (instalations && instalations.length > 0) {
      newInstalations = await Promise.all(
        instalations.map(instalation =>
          this.instalarionsService.create({
            ...instalation,
            order: newOrder,
          })
        )
      );
    }
  
    return await this.findByOrderNumber(orderData.orderNumber);
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

import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { OrdersRepository } from './orders.repository';
import { InstallationsService } from '../installations/installations.service';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { DeepPartial, DeleteResult } from 'typeorm';
import { InstallationDataRequesDto } from './dto/installation-data.request.dto';
import { calculateProgressFraction } from 'src/common/helpers/calculate-progress-fraction';
import { Order } from './entities/order.entity';
import { InstallationStatus } from 'src/common/enums/installations-status.enum';
import { calculateProgress } from 'src/common/helpers/calculate-progress';
import { UpdateInstallationStatus } from './dto/update-installation-status.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly installationsService: InstallationsService
  ) {}
  
  async create(createOrderDto: CreateOrderRequestDto) {
    const { installations, ...orderData } = createOrderDto;
  
    const existOrder = await this.ordersRepository.getByNumber(orderData.orderNumber);
    if (existOrder) throw new BadRequestException('Ya existe una orden con este número de referencia')
  
    const newOrder = await this.ordersRepository.create(orderData);
  
    if(!newOrder) throw new InternalServerErrorException('Hubo un problema al crear la orden')
  
    return newOrder
  }

  async addInstallations(id: string, data: InstallationDataRequesDto | InstallationDataRequesDto[]) {
    const order = await this.findOne(id);
    const installations = Array.isArray(data) ? data : [data];
    let fractioningOfInstallations: string = ''

    if (!order) throw new NotFoundException('orden no encontrada o numero invalido');
    const newInstallations = await this.installationsService.createFromOrder({order, installations})
    if(!newInstallations) throw new InternalServerErrorException('No se crearon las instalaciónes')
    const fraction = calculateProgressFraction((await this.findOne(id)).installations)
    return await this.update(order.id, {installationsFinished: fraction})

  }
  
  async updateInstallationStatus(orderId: string, installationId: string, status: UpdateInstallationStatus) {
    const order = await this.findOne(orderId)
    const installation = order.installations.find((installation) => installation.id === installationId)
    if(!installation) throw new NotFoundException('Instalación no encontrada o id invalido')
    
    const installationWithChanges = await this.installationsService.update(installation.id, status)

    if(installationWithChanges && installationWithChanges.status !== InstallationStatus.FINISHED) return installationWithChanges

    await this.updateProgress(orderId)

    return installationWithChanges
    }


  async installationToReview(orderId: string, installationId: string, data: Express.Multer.File) {
    const order = await this.findOne(orderId)
    const installation = order.installations.find(installation => installation.id === installationId)
    
    if(!installation) throw new NotFoundException('Instalción no encontrada')
    
    const result = await this.installationsService.sendToReview(installationId, data)

    // actualizaar instalación con los links
    /* 
    if(!result)
    this.eventEmiter.send('add-to-review', order)
    
    */
    // retornar instalacion con links
    return result
  }

  async findAll() {
    const orders = await this.ordersRepository.get()
    if(!orders.length) throw new NotFoundException('No se encontraron ordenes')
      return orders.map(order => new GetOrderResponseDto(order))
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
    const installations = (await this.findOne(id)).installations
    const progress = calculateProgress(installations)
    const installationsFinished = calculateProgressFraction(installations)

    return await this.update(id, {progress, installationsFinished})
  }
}

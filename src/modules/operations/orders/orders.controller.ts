import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { InstallationDataRequesDto } from './dto/installation-data.request.dto';
import { UpdateInstallationStatus } from './dto/update-installation-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Create new order',
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderRequestDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({
    summary: 'Add installation to an existed order',
  })
  @ApiBody({
    type: [InstallationDataRequesDto]
  })
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Post(':id/installations')
  async addInstallation(@Param('id') id: string, @Body() data: InstallationDataRequesDto | InstallationDataRequesDto[]) {
    return this.ordersService.addInstallations(id, data);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':orderId/installation/:installationId')
  async updateInstallation(
    @Param('orderId') orderId: string, 
    @Param('installationId') installationId: string , 
    @Body() status: UpdateInstallationStatus
  ) {
    return this.ordersService.updateInstallationStatus(orderId, installationId, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}

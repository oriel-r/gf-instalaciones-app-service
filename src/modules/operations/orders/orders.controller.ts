import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { InstalationDataRequesDto } from './dto/instalation-data.request.dto';

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
    summary: 'Add instalation to an existed order',
  })
  @ApiBody({
    type: [InstalationDataRequesDto]
  })
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Post(':id/instalations')
  async addInstalation(@Param('id') id: string, @Body() data: InstalationDataRequesDto | InstalationDataRequesDto[]) {
    return this.ordersService.addInstalations(id, data);
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}

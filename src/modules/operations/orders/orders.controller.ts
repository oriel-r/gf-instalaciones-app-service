import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InstallationDataRequesDto } from './dto/installation-data.request.dto';
import { UpdateInstallationStatus } from './dto/update-installation-status.dto';
import { OrderQueryOptionsDto } from './dto/orders-query-options.dto';
import { QueryOptionsPipe } from 'src/common/pipes/query-options/query-options.pipe';
import { Request } from 'express';
import { PaginatedResponseDto } from 'src/common/entities/paginated-response.dto';
import { Order } from './entities/order.entity';
import { GetOrderResponseDto } from './dto/get-order-response.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { InstallationQueryOptionsDto } from '../installations/dto/installation-query-options.dto';

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

  @ApiOperation({
    summary: 'get and filter orders',
  })
  @ApiQuery({
    type: () => OrderQueryOptionsDto,
  })
  @Get()
  async findAll(@Query(new QueryOptionsPipe(OrderQueryOptionsDto)) query: OrderQueryOptionsDto, @Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.host}${req.path}` + "?" + `${new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString()}`
        
    const result: PaginationResult<GetOrderResponseDto>= await this.ordersService.findAll(query);
    
    return new PaginatedResponseDto<GetOrderResponseDto>(result, baseUrl  ,query.page,query.limit)
  
  }

  @Get(':id/installations')
  async findOne(@Param('id') id: string, @Query() query: InstallationQueryOptionsDto) {
    return this.ordersService.findOneAndFilter(id,query);
  }

  @Get(':id')
  async findInstallationsByOrder(@Param('id') id: string) {
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

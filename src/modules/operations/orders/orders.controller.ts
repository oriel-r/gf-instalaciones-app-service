import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { UpdateInstallationStatus } from './dto/update-installation-status.dto';
import { OrderQueryOptionsDto } from './dto/orders-query-options.dto';
import { QueryOptionsPipe } from 'src/common/pipes/query-options/query-options.pipe';
import { Request } from 'express';
import { PaginatedResponseDto } from 'src/common/entities/paginated-response.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { InstallationQueryOptionsDto } from '../installations/dto/installation-query-options.dto';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { InstallationDataRequesDto } from './dto/installation-data.request.dto';
import { plainToInstance } from 'class-transformer';
import { validate, validateSync } from 'class-validator';
import { Public } from 'src/common/decorators/roles/public';
import { BatchKeyGuard } from 'src/common/guards/batch-loading/batch-loading.guard';

@Roles(RoleEnum.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Create new order',
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderRequestDto) {
    const newOrder = await this.ordersService.create(createOrderDto);
    return new GetOrderResponseDto(newOrder)
  }

  @ApiOperation({
    summary: 'endpoint for create installations from a batch'
  })
  @Public()
  @UseGuards(BatchKeyGuard)
  @Post('batch_load/installations')
  async addInstallationsBatch(@Body() data: any[]) {
    const installationsData = data.map(installationData => plainToInstance(InstallationDataRequesDto, installationData ))
    return await this.ordersService.addInstallations(installationsData)
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
  async addInstallation(@Param('id') id: string, @Body() data: InstallationDataRequesDto) {
 
    const orderWithNewInstallation = await this.ordersService.addInstallations(data, id);
    return orderWithNewInstallation
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @ApiOperation({
    summary: 'get and filter orders',
  })
  @ApiQuery({
    type: () => OrderQueryOptionsDto,
  })
  @Get()
  async findAll(@Query(new QueryOptionsPipe(OrderQueryOptionsDto)) query: OrderQueryOptionsDto, @Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.host}${req.path}` + "?" + `${new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString()}`

    const role = req['user']['roles']
    const result: PaginationResult<GetOrderResponseDto>= await this.ordersService.findAll(query, role);
    
    return new PaginatedResponseDto<GetOrderResponseDto>(result  ,query.page, query.limit, baseUrl)
  
  }

 @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id/installations')
  async findInstallationsFromOrder(
    @Param('id') id: string, 
    @Query(new QueryOptionsPipe(InstallationQueryOptionsDto)) query: InstallationQueryOptionsDto,
    @Req() req: Request
  ) {

    return await this.ordersService.getInstallationsFromId(id, query);
  }

  @ApiOperation({
      summary: 'this endpoint recive the sheets data'
    })
  @Public()
  @UseGuards(BatchKeyGuard)
  @Post('batch_load')
  async createOrders(@Body() data ) {
    const dataArray = Array.isArray(data) ? data : [data]
  
    const orders = dataArray
    .map(orderData => this.ordersService.create(orderData)
    .then(response => ({
        status: 'fulfilled' as const,
        referenceId: response.orderNumber
      }))
    .catch(error => ({
        status: 'reject' as const,
        reason: error['response']['message'],
        referenceId: orderData.orderNumber
      }))
    )

    const result = await Promise.all(orders)
    
    return result
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    //const roles = req['user'].roles
    const result = await this.ordersService.findOne(id);
    return new GetOrderResponseDto(result)
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
    return
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}

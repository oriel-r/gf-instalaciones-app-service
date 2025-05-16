import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { DeepPartial, Repository } from "typeorm";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderQueryOptionsDto } from "./dto/orders-query-options.dto";
import { PaginationResult } from "src/common/interfaces/pagination-result.interface";
import { InstallationQueryOptionsDto } from "../installations/dto/installation-query-options.dto";
import { Provinces } from "src/common/enums/provinces.enum";
import { RolePayload } from "src/common/entities/role-payload.dto";

@Injectable()
export class OrdersRepository { 
    constructor(
        @InjectRepository(Order) private readonly ordersRepository: Repository<Order>
    ) {}

    async create(data: Partial<Order>) {
        return await this.ordersRepository.save(
            await this.ordersRepository.create(data)
        )
    }

    async get(query: OrderQueryOptionsDto, clientId?: string | null) {
        const queryBuilder = this.ordersRepository.createQueryBuilder('order')
        console.log(clientId)
        queryBuilder
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('client.user', 'clientUser')
        .leftJoinAndSelect('order.installations', 'installations')
        .leftJoinAndSelect('installations.address', 'address')
        .leftJoinAndSelect('installations.installers', 'installers')
        .leftJoinAndSelect('installers.user', 'installersUsers')
        .leftJoinAndSelect('installations.coordinator', 'coordinator')
        .leftJoinAndSelect('coordinator.user', 'coordinatorUser')
        .leftJoinAndSelect('address.city', 'city')
        .leftJoinAndSelect('city.province', 'province')
        .addSelect('order.createdAt')

        if(query.completed !== undefined) {
            queryBuilder.andWhere('order.completed = :completed', {completed: query.completed})
        }

        if(query.progress) {
            queryBuilder.orderBy('order.progress', query.progress)
        }

        if(query.createdAt) {
            queryBuilder.addOrderBy('order.createdAt', query.createdAt)
        }

        if(clientId) {
            queryBuilder.andWhere('client.id = :clientId', {clientId: clientId})
        } 

        if(query.updatedAt) {
            queryBuilder.addSelect('order.updatedAt')
            queryBuilder.addOrderBy('order.updatedAt', query.updatedAt)
        }

        queryBuilder
        .skip((query.page - 1) * query.limit)
        .take(query.limit);

    const findResult = await queryBuilder.getManyAndCount()
    return findResult
    
    }

    async getById(id: string, clientId?: string | null) {
        const qb = await this.ordersRepository
         .createQueryBuilder('order')                     
         .leftJoinAndSelect('order.client', 'client')
         .leftJoinAndSelect('client.user', 'clientUser')
         .leftJoinAndSelect('order.installations', 'inst')
         .leftJoinAndSelect('inst.coordinator', 'coord')
         .leftJoinAndSelect('coord.user', 'coordUser')
         .leftJoinAndSelect('inst.installers', 'installer')
         .leftJoinAndSelect('installer.user', 'installerUser')
         .leftJoinAndSelect('inst.address', 'addr')
            .leftJoinAndSelect('addr.city', 'city')
         .leftJoinAndSelect('city.province', 'prov')
         .addSelect('order.createdAt')                   
         .where('order.id = :orderId', {orderId: id})
        if(clientId) {
            qb.andWhere('client.id = :clientId', {clientId: clientId})
        }

        return await qb.getOne()
    }

    async getOneAndFilterInstallations (id: string, query: InstallationQueryOptionsDto) {
        const queryBuilder = this.ordersRepository.createQueryBuilder('order')

        queryBuilder
        .where({id})
        .leftJoinAndSelect('order.installations', 'installations')
        .leftJoinAndSelect('installations.coordinator', 'coordinator')
        .leftJoinAndSelect('coordinator.user', 'coordinatorUser')
        .leftJoinAndSelect('installations.installers', 'installers')
        .leftJoinAndSelect('installers.user', 'installerUser') 
        .leftJoinAndSelect('installations.address', 'address')
        .leftJoinAndSelect('address.city', 'city')
        .leftJoinAndSelect('city.province', 'province')

    
        
          if(query.createdAt) {
            queryBuilder.addSelect('installations.createdAt')
            queryBuilder.addOrderBy('installations.createdAt', query.createdAt)
        }

        if(query.updatedAt) {
            queryBuilder.addSelect('installations.updatedAt')
            queryBuilder.addOrderBy('installations.updatedAt', query.updatedAt)
        }
        
        const result = (await queryBuilder.getOne())?.installations
        return result
    }

    async getByNumber(orderNumber: string) {
        return await this.ordersRepository.findOneBy({orderNumber})
    }

    async update(id: string, data: DeepPartial<Order>) {
        return await this.ordersRepository.update(id, data)
    }

    async softDelete(id: string) {
        return await this.ordersRepository.softDelete(id)
    } 
}
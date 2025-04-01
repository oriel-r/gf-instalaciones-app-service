import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { DeepPartial, Repository } from "typeorm";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderQueryOptionsDto } from "./dto/orders-query-options.dto";
import { PaginationResult } from "src/common/interfaces/pagination-result.interface";

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

    async get(query: OrderQueryOptionsDto) {
        const queryBuilder = this.ordersRepository.createQueryBuilder('order')

        queryBuilder
        .leftJoinAndSelect('order.client', 'client')
        .leftJoinAndSelect('order.installations', 'installations')
        .leftJoinAndSelect('installations.address', 'address')
        .leftJoinAndSelect('installations.installers', 'installers')
        .leftJoinAndSelect('installations.coordinator', 'coordinator')
        .leftJoinAndSelect('address.city', 'city')
        .leftJoinAndSelect('city.province', 'province')
        

        if(query.completed !== undefined) {
            queryBuilder.andWhere('order.completed = :completed', {completed: query.completed})
        }

        if(query.progress) {
            queryBuilder.orderBy('order.progress', query.progress)
        }

        if(query.createdAt) {
            queryBuilder.addSelect('order.createdAt')
            queryBuilder.addOrderBy('order.createdAt', query.createdAt)
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

    async getById(id: string) {
        return await this.ordersRepository.findOneBy({id})
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
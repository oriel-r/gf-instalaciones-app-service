import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { DeepPartial, Repository } from "typeorm";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderQueryOptionsDto } from "./dto/orders-query-options.dto";
import { PaginationResult } from "src/common/interfaces/pagination-result.interface";
import { InstallationQueryOptionsDto } from "../installations/dto/installation-query-options.dto";
import { Provinces } from "src/common/enums/provinces.enum";

@Injectable()
export class OrdersRepository { 
    constructor(
        @InjectRepository(Order) private readonly ordersRepository: Repository<Order>
    ) {}

    private readonly filterConditions = {
        province: 'province.name = :province',
        city: 'city.name = :city',
        status: 'installations.status = :status'
      };

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
        return await this.ordersRepository.findOne({
            where: {id},
            relations: {
                client: {
                    user: true
                },
                installations: {
                    coordinator: {
                        user: true
                    },
                    installers: true,
                    address: {
                        city: {
                            province: true
                        }
                    }
                }
            }
        })
    }

    async getOneAndFilterInstallations (id: string, query: InstallationQueryOptionsDto) {
        const queryBuilder = this.ordersRepository.createQueryBuilder('order')

        queryBuilder
        .where({id})
        .leftJoinAndSelect('order.installations', 'installations')
        .leftJoinAndSelect('installations.coordinator', 'coordinator')
        .leftJoinAndSelect('coordinator.user', 'coordinatorUser')
        .leftJoinAndSelect('installations.installers', 'installers')
        .leftJoinAndSelect('installers.userRoleDetail', 'userRoleDetail') 
        .leftJoinAndSelect('userRoleDetail.user', 'installerUser') 
        .leftJoinAndSelect('installations.address', 'address')
        .leftJoinAndSelect('address.city', 'city')
        .leftJoinAndSelect('city.province', 'province')

        Object.entries(this.filterConditions).forEach(([key, condition]) => {
            if (query[key]) {
              queryBuilder.andWhere(condition, { [key]: query[key] });
            }
          });
        
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
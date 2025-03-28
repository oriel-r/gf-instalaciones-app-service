import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { DeepPartial, Repository } from "typeorm";
import { UpdateOrderDto } from "./dto/update-order.dto";

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

    async get() {
        return await this.ordersRepository.find({
        relations: {
            client: true, 
            installations:{
                coordinator: true, 
                installers: true, 
                address:{
                    city:{
                        province: true
                    }
                }
            }
        },
            order: {
                createdAt: 'DESC'
            }
        })
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
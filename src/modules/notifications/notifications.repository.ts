import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationsRepository {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationsRepository: Repository<Notification>
    ) {}

    async get(id: string) {
        return await this.notificationsRepository.findOneBy({id})
    }

    async getAll() {
        return await this.notificationsRepository.find()
    }

    async create(data: CreateNotificationDto) {
        return await this.notificationsRepository.save(
            this.notificationsRepository.create(data)
        )
    }

    async delete() {
        'deleted'
    }
    
}
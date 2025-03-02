import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Instalation } from "./entities/instalation.entity";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class InstalationsRepository {
    constructor(
        @InjectRepository(Instalation) private readonly instalarionsRepository: Repository<Instalation>
    ) {}

    async create(data) {
        return await this.instalarionsRepository.save(
            await this.instalarionsRepository.create(data)
        )

    }

    async get() {
        return await this.instalarionsRepository.find()
    }

    async getById(id: string) {
        return await this.instalarionsRepository.findOneBy({id})
    }

    async update(id: string, data: DeepPartial<Instalation>) {
        return await this.instalarionsRepository.update(id, data)
    }

    async softDelete(id: string) {
        return await this.instalarionsRepository.softDelete(id)
    }   

}
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Adress } from "./entities/adress.entity";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class AdressRepository {
    constructor(
        @InjectRepository(Adress) private readonly adressesReposiroy: Repository<Adress>
    ) {}

    async create(data: Partial<Adress>) {
        return await this.adressesReposiroy.save(
            await this.adressesReposiroy.create(data)
        )
    }

    async get() {
        return await this.adressesReposiroy.find()
    }

    async getById(id: string) {
        return await this.adressesReposiroy.findOneBy({id})
    }

    async update(id: string, data: DeepPartial<Adress>) {
        return await this.adressesReposiroy.update(id, data)
    }

    async softDelete(id: string) {
        return await this.adressesReposiroy.softDelete(id)
    }

}
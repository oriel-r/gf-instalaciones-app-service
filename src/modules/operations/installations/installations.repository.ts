import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Installation } from "./entities/installation.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateAdminDto } from "../../admins/dto/create-admin.dto";
import { CreateInstallationDto } from "./dto/create-installation.dto";

@Injectable()
export class InstallationsRepository {
    constructor(
        @InjectRepository(Installation) private readonly installationsRepository: Repository<Installation>
    ) {}

    async create(data: DeepPartial<Installation>) {
        return await this.installationsRepository.save(
            await this.installationsRepository.create(data)
        )

    }

    async get() {
        return await this.installationsRepository.find()
    }

    async getById(id: string) {
        return await this.installationsRepository.findOneBy({id})
    }

    async update(id: string, data: DeepPartial<Installation>) {
        return await this.installationsRepository.update(id, data)
    }

    async softDelete(id: string) {
        return await this.installationsRepository.softDelete(id)
    }   

}
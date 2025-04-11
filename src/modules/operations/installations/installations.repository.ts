import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Installation } from "./entities/installation.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateAdminDto } from "../../admins/dto/create-admin.dto";
import { CreateInstallationDto } from "./dto/create-installation.dto";
import { UpdateInstallationDto } from "./dto/update-installation.dto";
import { StatusChangeDto } from "./dto/change-status.dto";

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
        return await this.installationsRepository.findOne({
            where:{id},
            relations: ['installers', 'order' , 'order.client', 'coordinator', 'coordinator.user', 'address', 'address.city', 'address.city.province']
        })
    }

    async update(id: string, data: DeepPartial<Installation>) {
        if (data.installers) {
          const installation = await this.getById(id);
          if (!installation) return null;
          Object.assign(installation, data);
          return await this.installationsRepository.save(installation);
        }
      
        const result = await this.installationsRepository.update(id, data);
        if (!result.affected) return null;
        return this.getById(id);
      }
      
    async softDelete(id: string) {
        return await this.installationsRepository.softDelete(id)   
    }   

}
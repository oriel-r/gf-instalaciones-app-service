import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Installation } from "./entities/installation.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateInstallationDto } from "./dto/create-installation.dto";
import { UpdateInstallationDto } from "./dto/update-installation.dto";
import { StatusChangeDto } from "./dto/change-status.dto";
import { InstallationQueryOptionsDto } from "./dto/installation-query-options.dto";

@Injectable()
export class InstallationsRepository {
    constructor(
        @InjectRepository(Installation) private readonly installationsRepository: Repository<Installation>
    ) {}

    private readonly filterConditions = {
        province: 'province.name = :province',
        city: 'city.name = :city',
        status: 'installations.status = :status'
      };

    async create(data: DeepPartial<Installation>) {
        const installation = await this.installationsRepository.save(
            await this.installationsRepository.create(data)
        )
        return this.getById(installation.id)
    }

    async get() {
        return await this.installationsRepository.find({
            relations: ['installers', 'installers.user', 'coordinator', 'coordinator.user', 'address', 'address.city', 'address.city.province', ]
        })
    }

    async getAllByOrder(query: InstallationQueryOptionsDto, orderId?: string, coordinatorId?: string, installerId?: string) {
        const queryBuilder = this.installationsRepository.
        createQueryBuilder('installations')
        .leftJoinAndSelect('installations.address', 'address')
        .leftJoinAndSelect('address.city', 'city')
        .leftJoinAndSelect('city.province', 'province')
        .leftJoinAndSelect('installations.coordinator', 'coordinator')
        .leftJoinAndSelect('coordinator.user', 'coordinatorUser')
        .leftJoinAndSelect('installations.installers', 'installers')
        .leftJoinAndSelect('installers.user', 'installerUser');

        if (orderId) {
            queryBuilder.innerJoin('installations.order', 'order', 'order.id = :orderId', { orderId });
        }
        
        if (coordinatorId || installerId) {
        const conditions: string[] = [];
        const params: any = {};
        
        if (coordinatorId) {
            conditions.push('coordinator.id = :coordinatorId');
              params.coordinatorId = coordinatorId;
        }
        if (installerId) {
            conditions.push('installers.id = :installerId');
            params.installerId = installerId;
        }

            queryBuilder.andWhere(conditions.join(' OR '), params);
        }
        
        
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

        queryBuilder
        .skip((query.page - 1) * query.limit)
        .take(query.limit);
        
        const result = await queryBuilder.getManyAndCount()
        return result
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
        return await this.getById(id);
      }
      
    async softDelete(id: string) {
        return await this.installationsRepository.softDelete(id)   
    }   

}
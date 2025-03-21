import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "./entities/city.entity";
import { DeepPartial, Repository } from "typeorm";
import { UpdateCityDto } from "./dto/update-city.dto";

@Injectable()
export class CityRepository {
    constructor(
        @InjectRepository(City) private readonly citiesRepository: Repository<City>
    ) {}

    async get() {
        return await this.citiesRepository.find()
    }

    async getById(id: string) {
        return await this.citiesRepository.findOneBy({id})
    } 

    async getByName(name: string) {
        return await this.citiesRepository.findOneBy({name})
    } 

    async create(data: DeepPartial<City>) {
        return await this.citiesRepository.save(
            await this.citiesRepository.create(data)
        )
    } 

    async update(id: string, data: DeepPartial<City>) {
        return await this.citiesRepository.update(id, data)
    } 

    async softDelete(id: string) {
        return await this.citiesRepository.softDelete(id)
    } 


}
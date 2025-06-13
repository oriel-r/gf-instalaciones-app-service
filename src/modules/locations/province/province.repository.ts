import { Injectable } from '@nestjs/common';
import { Province } from './entities/province.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceRepository {
  constructor(
    @InjectRepository(Province)
    private readonly provineRepository: Repository<Province>,
  ) {}

  async get() {
    return await this.provineRepository.find();
  }

  async getById(id: string) {
    return await this.provineRepository.findOneBy({ id });
  }

  async getByName(name: string) {
    return await this.provineRepository.findOneBy({ name });
  }

  async create(data) {
    return await this.provineRepository.save(
      await this.provineRepository.create(data),
    );
  }

  async update(id: string, data) {
    return await this.provineRepository.update(id, data);
  }

  async softRemove(id: string) {
    return await this.provineRepository.softDelete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private readonly AddressesReposiroy: Repository<Address>,
  ) {}

  async create(data: Partial<Address>) {
    return await this.AddressesReposiroy.save(
      await this.AddressesReposiroy.create(data),
    );
  }

  async get() {
    return await this.AddressesReposiroy.find();
  }

  async getById(id: string) {
    return await this.AddressesReposiroy.findOneBy({ id });
  }

  async update(id: string, data: DeepPartial<Address>) {
    return await this.AddressesReposiroy.update(id, data);
  }

  async softDelete(id: string) {
    return await this.AddressesReposiroy.softDelete(id);
  }
}

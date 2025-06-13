import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { ProvinceRepository } from './province.repository';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';

@Injectable()
export class ProvinceService {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async create(data: CreateProvinceDto) {
    const existProvince = await this.provinceRepository.getByName(data.name);
    if (existProvince) throw new ConflictException('Esta provincia ya existe');
    return await this.provinceRepository.create(data);
  }

  async findAll() {
    const provinces = await this.provinceRepository.get();
    if (!provinces || provinces.length === 0)
      throw new NotFoundException('No se encontraron provincias');
    return provinces;
  }

  async findOne(id: string) {
    const province = await this.provinceRepository.getById(id);
    if (!province) throw new NotFoundException('No se encontro la provincia');
    return province;
  }

  async findOneByName(name: string) {
    const province = await this.provinceRepository.getByName(name);
    if (!province) throw new NotFoundException('No se encontro la provincia');
    return province;
  }

  async update(id: string, data: UpdateProvinceDto) {
    const existProvince = await this.provinceRepository.getById(id);
    if (!existProvince)
      throw new NotFoundException('No se encontro la provincia, id invalido');
    return await this.provinceRepository.update(id, data);
  }

  async remove(id: string) {
    const province = await this.provinceRepository.getById(id);
    if (!province) throw new NotFoundException('No se encontro la provincia');
    const result = await this.provinceRepository.softRemove(id);
    if (result.affected) return new DeleteResponse('provincia', id);
  }
}

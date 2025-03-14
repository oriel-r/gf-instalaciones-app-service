import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInstalationDto } from './dto/create-instalation.dto';
import { UpdateInstalationDto } from './dto/update-instalation.dto';
import { InstalationsRepository } from './instalarion.repository';
import { DeepPartial } from 'typeorm';
import { Instalation } from './entities/instalation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { AdressService } from 'src/modules/locations/adress/adress.service';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class InstalationsService {
  constructor(
    private readonly instalationsRepository: InstalationsRepository,
    private readonly adressService: AdressService
  ){}
  
  async createFromOrder(createInstalationDto: CreateInstalationDto) {

    const newInstalations = await Promise.all(
      createInstalationDto.instalations.map(async (instalation) => {
        const { adress, ...otherData } = instalation;
  
        const instalationAdress = await this.adressService.create(adress);
  
        return await this.instalationsRepository.create({
          ...otherData,
          order: createInstalationDto.order,
          adress: instalationAdress,
        })

      })
    );
  
    return newInstalations;
  }
  
  async create(data) {
    return {newData: data}
  }

  async findAll() {
    const instalations = await this.instalationsRepository.get()
    if(!instalations.length) throw new NotFoundException('No se encontraron isntalaciones')
      return instalations
  }

  async findOne(id: string) {
    const instalation = await this.instalationsRepository.getById(id)
    if(!instalation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
      return instalation  }

  async update(id: string, updateInstalationDto: DeepPartial<Instalation>) {
    const instalation = await this.instalationsRepository.getById(id)
    if(!instalation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.instalationsRepository.update(id, updateInstalationDto)
    if(!result.affected) throw new InternalServerErrorException('No se pudo actualizar el estado de la orden')
    return await this.instalationsRepository.getById(id)
  }

  async sendToReview(id: string, data) {
    return 'Work in progress'
  }

  async remove(id: string) {
    const instalation = await this.instalationsRepository.getById(id)
    if(!instalation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.instalationsRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('instalación', id)
  }
}

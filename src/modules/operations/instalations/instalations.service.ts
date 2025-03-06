import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInstalationDto } from './dto/create-instalation.dto';
import { UpdateInstalationDto } from './dto/update-instalation.dto';
import { InstalationsRepository } from './instalarion.repository';
import { DeepPartial } from 'typeorm';
import { Instalation } from './entities/instalation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { AdressService } from 'src/modules/locations/adress/adress.service';

@Injectable()
export class InstalationsService {
  constructor(
    private readonly instalarionsRepository: InstalationsRepository,
    private readonly adressService: AdressService
  ){}
  
  async createFromOrder(createInstalationDto: CreateInstalationDto) {
    const {adress, ...instalationData} = createInstalationDto
    const anAdress = await this.adressService.create(adress)
    if(!anAdress) throw new InternalServerErrorException('Hubo un problema al crear la instalación')
    const instalation = await this.instalarionsRepository.create({
    ...instalationData,
    adress: anAdress,
    })
    if(!instalation) throw new HttpException('No se pudo crear la isntalción', HttpStatus.INTERNAL_SERVER_ERROR)
      return instalation
  }
  
  async create(data) {
    return {newData: data}
  }

  async findAll() {
    const instalations = await this.instalarionsRepository.get()
    if(!instalations.length) throw new NotFoundException('No se encontraron isntalaciones')
      return instalations
  }

  async findOne(id: string) {
    const instalation = await this.instalarionsRepository.getById(id)
    if(!instalation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
      return instalation  }

  async update(id: string, updateInstalationDto: DeepPartial<Instalation>) {
    const instalation = await this.instalarionsRepository.getById(id)
    if(!instalation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
      return this.instalarionsRepository.update(id, updateInstalationDto)
  }

  async remove(id: string) {
    const instalation = await this.instalarionsRepository.getById(id)
    if(!instalation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.instalarionsRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('instalación', id)
  }
}

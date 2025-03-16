import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateInstalationDto } from './dto/create-instalation.dto';
import { UpdateInstalationDto } from './dto/update-instalation.dto';
import { InstalationsRepository } from './instalarion.repository';
import { DeepPartial } from 'typeorm';
import { Instalation } from './entities/instalation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response';
import { AdressService } from 'src/modules/locations/adress/adress.service';
import { Order } from '../orders/entities/order.entity';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InstalationsService {
  constructor(
    private readonly instalationsRepository: InstalationsRepository,
    private readonly adressService: AdressService,
    private readonly fileUploadService: FileUploadService,
    private evenEmitter: EventEmitter2
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
    const instalation = await this.findOne(id)
    const imagesUrls = await Promise.all(data.map((image) =>
      this.fileUploadService.uploadFile(image)
    ))

    if(!imagesUrls || !imagesUrls.length ) throw new ServiceUnavailableException('Hubo un problema al subir la imagen')
    const result = await this.update(instalation.id, {images: imagesUrls})
    this.evenEmitter.emit('installation.sendToReview', id)
    return await this.findOne(id)
  }

  async remove(id: string) {
    const instalation = await this.instalationsRepository.getById(id)
    if(!instalation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.instalationsRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('instalación', id)
  }
}

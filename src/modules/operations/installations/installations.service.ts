import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { UpdateInstallationDto } from './dto/update-installation.dto';
import { InstallationsRepository } from './installations.repository';
import { DeepPartial } from 'typeorm';
import { Installation } from './entities/installation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { AdressService } from 'src/modules/locations/adress/adress.service';
import { Order } from '../orders/entities/order.entity';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InstallationsService {
  constructor(
    private readonly installationsRepository: InstallationsRepository,
    private readonly adressService: AdressService,
    private readonly fileUploadService: FileUploadService,
    private evenEmitter: EventEmitter2
  ){}
  
  async createFromOrder(createInstallationDto: CreateInstallationDto) {

    const newInstallations = await Promise.all(
      createInstallationDto.installations.map(async (installation) => {
        const { adress, ...otherData } = installation;
  
        const installationAdress = await this.adressService.create(adress);
  
        return await this.installationsRepository.create({
          ...otherData,
          order: createInstallationDto.order,
          adress: installationAdress,
        })

      })
    );
  
    return newInstallations;
  }
  
  async create(data) {
    return {newData: data}
  }

  async findAll() {
    const installations = await this.installationsRepository.get()
    if(!installations.length) throw new NotFoundException('No se encontraron isntalaciones')
      return installations
  }

  async findOne(id: string) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
      return installation  }

  async update(id: string, updateInstallationDto: DeepPartial<Installation>) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.installationsRepository.update(id, updateInstallationDto)
    if(!result.affected) throw new InternalServerErrorException('No se pudo actualizar el estado de la orden')
    return await this.installationsRepository.getById(id)
  }

  async sendToReview(id: string, data) {
    const installation = await this.findOne(id)
    const imagesUrls = await Promise.all(data.map((image) =>
      this.fileUploadService.uploadFile(image)
    ))

    if(!imagesUrls || !imagesUrls.length ) throw new ServiceUnavailableException('Hubo un problema al subir la imagen')
    const result = await this.update(installation.id, {images: imagesUrls})
    this.evenEmitter.emit('installation.sendToReview', id)
    return await this.findOne(id)
  }

  async remove(id: string) {
    const installation = await this.installationsRepository.getById(id)
    if(!installation) throw new NotFoundException('Instalación no encontrada, id incorrecto o inexistente')
    const result = await this.installationsRepository.softDelete(id)
    if(result.affected) return new DeleteResponse('instalación', id)
  }
}

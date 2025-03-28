import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { InstallationsRepository } from './installations.repository';
import { DeepPartial } from 'typeorm';
import { Installation } from './entities/installation.entity';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { AddressService } from 'src/modules/locations/address/address.service';
import { Order } from '../orders/entities/order.entity';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InstallationsService {
  constructor(
    private readonly installationsRepository: InstallationsRepository,
    private readonly addressService: AddressService,
    private readonly fileUploadService: FileUploadService,
    private evenEmitter: EventEmitter2
  ){}
  
  async createFromOrder(createInstallationDto: CreateInstallationDto) {

    const newInstallations = await Promise.all(
      createInstallationDto.installations.map(async (installation) => {
        const { address, coordinatorId,...otherData } = installation;

        const coordinator = await this.evenEmitter.emitAsync('verifyRole.coordinator', coordinatorId)
  
        if(!coordinator[0]) throw new BadRequestException('Coordinador no encontrado')

        const installationAddress = await this.addressService.create(address);
  
        return await this.installationsRepository.create({
          ...otherData,
          order: createInstallationDto.order,
          coordinator: coordinator[0],
          address: installationAddress,
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

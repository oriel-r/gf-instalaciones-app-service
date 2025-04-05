import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/images.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async saveFile({ url, mimetype }: { url: string; mimetype: string }) {
    const image = new Image();
    image.url = url;
    image.mimetype = mimetype;

    return await this.imageRepository.save(image);
  }

  async findAll() {
    return await this.imageRepository.find();
  }
}

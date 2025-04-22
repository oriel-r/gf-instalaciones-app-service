import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/images.entity';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesService, FileUploadService],
  controllers: [ImagesController],
  exports: [ImagesService]
})
export class ImagesModule {}

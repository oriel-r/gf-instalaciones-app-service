import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { FilesPipe } from 'src/common/pipes/file/files-pipe';
import { FilePipe } from 'src/common/pipes/file/file.pipe';
import { FileUploadService } from 'src/services/files/file-upload.service';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imageService: ImagesService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(
    new FilePipe(1000, 5000000, ['image/png', 'image/jpeg', 'application/pdf']),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.fileUploadService.uploadFile(file);

    return await this.imageService.saveFile({
      url: fileUrl,
      mimetype: file.mimetype,
    });
  }

  @Post('upload/images')
  @UseInterceptors(FilesInterceptor('files', 10))
  @UsePipes(
    new FilesPipe(1000, 10000000, [
      'image/png',
      'image/jpeg',
      'application/pdf',
    ]),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileUrl = await this.fileUploadService.uploadFile(file);
        return await this.imageService.saveFile({
          url: fileUrl,
          mimetype: file.mimetype,
        });
      }),
    );

    return uploadedFiles;
  }

  @Get()
  async findAll() {
    return await this.imageService.findAll();
  }
}

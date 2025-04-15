import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FilesPipe implements PipeTransform {
  private min: number;
  private max: number;
  private mimetype: string[];

  constructor(min: number, max: number, mimetype: string[]) {
    this.max = max;
    this.min = min;
    this.mimetype = mimetype;
  }


  transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
    console.log(files)
    console.log('Is Array' + !Array.isArray(files))
    console.log(files.length)
    if (!Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('Debe subir al menos un archivo.');
    }

    files.forEach((file) => {
      if (!file) throw new BadRequestException('Se requiere un archivo.');
      if (file.size > this.max) throw new BadRequestException(`El archivo "${file.originalname}" es demasiado grande (${this.max} bytes máx.).`);
      if (file.size < this.min) throw new BadRequestException(`El archivo "${file.originalname}" es demasiado pequeño (${this.min} bytes mín.).`);
      if (!this.mimetype.includes(file.mimetype)) throw new BadRequestException(`El archivo "${file.originalname}" tiene un formato inválido. Permitidos: ${this.mimetype.join(', ')}.`);
    });

    return files;
  }
}

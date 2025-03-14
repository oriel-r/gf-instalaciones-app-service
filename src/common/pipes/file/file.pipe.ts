import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  
  @Injectable()
  export class FilePipe implements PipeTransform {
    min: number;
    max: number;
    mimetype: string[];
  
    constructor(min: number, max: number, mimetype: string[]) {
      this.max = max;
      this.min = min;
      this.mimetype = mimetype;
    }
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
      if (!value) throw new BadRequestException('el archivo es requerido');
      if (Number(value.size) > this.max)
        throw new BadRequestException('este archivo es más grande de lo permitido');
      if (Number(value.size) < this.min)
        throw new BadRequestException('este archivo es más pequeño de lo permitido');
      if (!this.mimetype.includes(value.mimetype))
        throw new BadRequestException('el formato de archivo no es válido');
  
      return value;
    }
  }
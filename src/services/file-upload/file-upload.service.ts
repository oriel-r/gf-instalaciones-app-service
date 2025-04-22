import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join, extname, resolve } from 'path';
import * as fsp from 'fs/promises';

@Injectable()
export class FileUploadService {
  private readonly uploadDir: string;
  private readonly domain: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = resolve(this.configService.get<string>('UPLOAD_DIR')!);
    this.domain = this.configService.get<string>('UPLOAD_DOMAIN')!;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    const destination = join(this.uploadDir, fileName);
  
    console.log('📂 Ruta absoluta de destino:', destination);
    console.log('🧪 ¿Existe buffer?', !!file.buffer, 'Tamaño:', file.buffer?.length);
  
    await fsp.mkdir(this.uploadDir, { recursive: true });
    await fsp.writeFile(destination, file.buffer);
  
    console.log('✅ Archivo escrito correctamente');
  
    return `${this.domain}/uploads/${fileName}`;
  } 
}
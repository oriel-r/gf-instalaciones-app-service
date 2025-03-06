import { Injectable } from '@nestjs/common';
import * as FTP from 'ftp';

@Injectable()
export class FileUploadService {
  private readonly ftpConfig = {
    host: 'tu-servidor.siteground.com',
    user: 'tu-usuario',
    password: 'tu-contraseña',
  };

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const client = new FTP();
    
    return new Promise((resolve, reject) => {
      client.on('ready', () => {
        client.put(file.buffer, `/uploads/${file.filename}`, (err) => {
          if (err) reject(err);
          client.end();
          resolve(`https://tu-dominio.com/uploads/${file.filename}`);
        });
      });

      client.connect(this.ftpConfig);
    });
  }
}

import { Injectable } from '@nestjs/common';
import * as ftp from 'basic-ftp';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FileUploadService {
  private readonly ftpConfig = {
    host: process.env.SITEGROUND_FTP_HOST,
    user: process.env.SITEGROUND_FTP_USER,
    password: process.env.SITEGROUND_FTP_PASS,
  };

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Para ver logs en la consola

    try {
      // Conectar al servidor FTP
      await client.access({
        host: this.ftpConfig.host,
        port: 8000,
        user: this.ftpConfig.user,
        password: this.ftpConfig.password,
        secure: false, // Asegúrate de que SiteGround permita conexiones no seguras o cambia a 'true' si usas SFTP
      });

      // Ruta en el servidor FTP (debe ser public_html/uploads)
      const remotePath = `/public_html/uploads/${file.originalname}`;

      // Subir el archivo
      await client.uploadFrom(file.path, remotePath);

      // Cerrar conexión
      client.close();

      return `https://tu-dominio.com/uploads/${file.originalname}`;
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      client.close();
      throw new Error('No se pudo subir el archivo');
    }
  }
}


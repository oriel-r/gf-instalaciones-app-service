import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';

@Injectable()
export class FileUploadService {
  private storage: Storage;
  private bucketName: string;
  private bucket;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('GCLOUD_STORAGE_BUCKET')!;
    
    // Ya no es necesario pasar credenciales, las toma de GOOGLE_APPLICATION_CREDENTIALS
    this.storage = new Storage();
    this.bucket = this.storage.bucket(this.bucketName);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;

      const blob = this.bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype
      });

      return new Promise<string>((resolve, reject) => {
        blobStream.on('error', (err) => {
          reject(new InternalServerErrorException('Error subiendo archivo a GCS: ' + err.message));
        });

        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      throw new InternalServerErrorException('Error en uploadFile: ' + error.message);
    }
  }

  async listFiles(): Promise<string[]> {
  try {
    const [files] = await this.bucket.getFiles();
    // files es un array de objetos File, vamos a devolver solo los nombres
    return files.map(file => file.name);
  } catch (error) {
    throw new InternalServerErrorException('Error listando archivos: ' + error.message);
  }
}
}


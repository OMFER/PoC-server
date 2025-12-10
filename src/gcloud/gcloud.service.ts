import { Injectable, NotFoundException } from '@nestjs/common';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';

@Injectable()
export class GCloudService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
    this.bucketName = process.env.GCLOUD_BUCKET ?? '';
  }

  async uploadFile(file: Express.Multer.File, path: string) {
    try {
      const { originalname } = file;
      const id = crypto.randomUUID()
      const finalpath = `${path}/${originalname}`;
      const bucket = this.storage.bucket(this.bucketName);
      const blob = bucket.file(finalpath);
      const stream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      const res = await new Promise((resolve, reject) => {
        stream.on('finish', async () => {
          const [metadata] = await blob.getMetadata();
          resolve({
            idUUid: id,
            name: metadata.name,
          });
        });

        stream.on('error', (err) => reject(err));
        stream.end(file.buffer);
      });
      const url = await this.getSignedUrl(finalpath);

      return { image: res, url: url };
    } catch (error) {
      console.error(error);
      throw new Error('Error al subir el archivo');
    }
  }

  async deleteFile(path: string): Promise<any> {
    const bucket = this.storage.bucket(this.bucketName);
    const result =  await bucket.file(path).delete().catch((e) => {throw new NotFoundException(e)});
    return result
  }

  async getFileStream(fileName: string): Promise<NodeJS.ReadableStream> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);
    return file.createReadStream();
  }

  async getSignedUrl(filePath: string): Promise<string> {
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hora
    };
    const url = await this.storage
      .bucket(this.bucketName)
      .file(filePath)
      .getSignedUrl(options);

    return url[0];
  }
}

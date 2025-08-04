import { Injectable } from '@nestjs/common';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => any;
}

@Injectable()
export class FileUploadService {
  async saveFile(
    file: Promise<FileUpload>,
    uploadDir = 'uploads',
  ): Promise<string> {
    const { createReadStream, filename } = await file;

    // Ensure upload directory exists
    const fullUploadPath = join(process.cwd(), uploadDir);
    if (!existsSync(fullUploadPath)) {
      mkdirSync(fullUploadPath, { recursive: true });
    }

    const filePath = join(fullUploadPath, filename);

    await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject);
    });

    // Return relative path for DB storage
    return `${uploadDir}/${filename}`;
  }
}

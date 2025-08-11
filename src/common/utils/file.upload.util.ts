/* eslint-disable @typescript-eslint/unbound-method */
import { createWriteStream } from 'fs';
import { join } from 'path';
import { FileUpload } from 'graphql-upload-ts';

export async function saveUploadedFile(
  file: Promise<FileUpload>,
  folder = 'uploads',
): Promise<string> {
  const { createReadStream, filename } = await file;
  const savePath = join(process.cwd(), folder, filename);

  await new Promise<void>((resolve, reject) => {
    createReadStream()
      .pipe(createWriteStream(savePath))
      .on('finish', resolve)
      .on('error', reject);
  });

  return savePath;
}

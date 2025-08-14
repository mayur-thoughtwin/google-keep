/* eslint-disable @typescript-eslint/unbound-method */
import { FileUpload } from 'graphql-upload-ts';
import { CloudinaryService } from '../services/cloudinary.service';

export async function saveUploadedFile(
  file: Promise<FileUpload>,
  cloudinaryService: CloudinaryService,
  folder = 'google-keep',
): Promise<string> {
  return await cloudinaryService.uploadImage(file, folder);
}

export async function saveMultipleUploadedFiles(
  files: Promise<FileUpload>[],
  cloudinaryService: CloudinaryService,
  folder = 'google-keep',
): Promise<string[]> {
  return await cloudinaryService.uploadMultipleImages(files, folder);
}

// src/modules/notes/notes.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/entities/notes.entity';
import { NotesService } from './notes.service';
import { NotesResolver } from './notes.resolver';
import { FileUploadService } from '../common/utils/file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NotesService, NotesResolver, FileUploadService],
  exports: [NotesService],
})
export class NotesModule {}

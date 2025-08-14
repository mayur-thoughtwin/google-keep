// src/modules/notes/notes.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/entities/notes.entity';
import { NotesService } from './notes.service';
import { NotesResolver } from './notes.resolver';
import { Storage } from 'src/entities/storage.entity';
import { CloudinaryModule } from 'src/common/services/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Storage]), CloudinaryModule],
  providers: [NotesService, NotesResolver],
  exports: [NotesService],
})
export class NotesModule {}

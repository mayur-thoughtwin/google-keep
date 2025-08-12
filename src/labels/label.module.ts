import { Module } from '@nestjs/common';
import { LabelsResolver } from './label.resolver';
import { LabelsService } from './label.service';
import { Label } from 'src/entities/labels.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteLabels } from 'src/entities/note.labels.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label, NoteLabels])],
  providers: [LabelsResolver, LabelsService],
  exports: [LabelsService],
})
export class LabelsModule {}

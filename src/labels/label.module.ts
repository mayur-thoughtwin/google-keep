import { Module } from '@nestjs/common';
import { LabelsResolver } from './label.resolver';
import { LabelsService } from './label.service';
import { Label } from 'src/entities/labels.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Label])],
  providers: [LabelsResolver, LabelsService],
  exports: [LabelsService],
})
export class LabelsModule {}

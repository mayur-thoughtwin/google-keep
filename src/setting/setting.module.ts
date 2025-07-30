import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from 'src/entities/settings.entity';
import { SettingResolver } from './setting.resolver';
import { SettingsService } from './setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers: [SettingResolver, SettingsService],
  exports: [SettingsService],
})
export class SettingModule {}

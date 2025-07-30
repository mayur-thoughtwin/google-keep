import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from 'src/entities/settings.entity';
import { Repository } from 'typeorm';
import { UpdateSettingsInput } from './setting.type';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepo: Repository<Settings>,
  ) {}

  async updateSettings(
    userId: number,
    input: UpdateSettingsInput,
  ): Promise<Settings> {
    const existing = await this.settingsRepo.findOne({
      where: { user_id: userId },
    });

    if (!existing) {
      const newSettings = this.settingsRepo.create({
        user_id: userId,
        ...input,
      });
      return this.settingsRepo.save(newSettings);
    }
    const updated = this.settingsRepo.merge(existing, input);
    return this.settingsRepo.save(updated);
  }

  async getSettings(userId: number): Promise<Settings | null> {
    return this.settingsRepo.findOne({
      where: { user_id: userId },
      select: {
        id: true,
        user_id: true,
        is_new_item_at_bottom: true,
        is_display_rich: true,
        is_checked_item_at_bottom: true,
        is_dark_theme: true,
        is_sharing: true,
      },
    });
  }
}

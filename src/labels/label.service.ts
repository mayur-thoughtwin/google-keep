import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from 'src/entities/labels.entity';
import { Repository } from 'typeorm';
import { AddLabelInput } from './label.type';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private readonly labelRepo: Repository<Label>,
  ) {}

  async createLabel(userId: number, input: AddLabelInput): Promise<Label> {
    const existingLabel = await this.labelRepo.findOne({
      where: { user_id: userId, name: input.name },
    });
    if (existingLabel) {
      throw new Error('Label already exists for this user');
    }
    const label = this.labelRepo.create({ ...input, user_id: userId });
    return await this.labelRepo.save(label);
  }

  async getLabels(userId: number): Promise<Label[]> {
    return this.labelRepo.find({ where: { user_id: userId } });
  }

  async updateLabel(
    labelId: number,
    userId: number,
    data: AddLabelInput,
  ): Promise<Label | null> {
    const label = await this.labelRepo.findOne({
      where: { id: labelId, user_id: userId },
    });

    if (!label) return null;

    const existingLabel = await this.labelRepo.findOne({
      where: {
        user_id: userId,
        name: data.name,
      },
    });

    if (existingLabel && existingLabel.id !== labelId) {
      throw new Error('Label name already exists for this user');
    }

    // Step 3: Merge and save
    Object.assign(label, data);
    return this.labelRepo.save(label);
  }

  async deleteLabel(userId: number, labelId: number): Promise<string> {
    await this.labelRepo.delete({ user_id: userId, id: labelId });
    return 'true';
  }
}

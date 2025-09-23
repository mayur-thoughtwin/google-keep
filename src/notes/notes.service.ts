/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/entities/notes.entity';
import { ILike, IsNull, LessThan, Not, Repository } from 'typeorm';
import { AddNotesInput, UpdateNotesInput } from './notes.type';

import { Cron, CronExpression } from '@nestjs/schedule';
import { Storage } from 'src/entities/storage.entity';
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
  ) {}

  // async createNote(userId: number, input: AddNotesInput): Promise<Note> {
  //   const note = this.noteRepo.create({ ...input, user_id: userId });
  //   return await this.noteRepo.save(note);
  // }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoEmptyTrash() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await this.noteRepo.delete({
      deleted_at: LessThan(sevenDaysAgo),
    });

    if (result.affected && result.affected > 0) {
      console.log(`${result.affected} notes permanently deleted`);
    }
  }
  async createNote(
    userId: number,
    input: AddNotesInput,
    savePath?: string | null,
  ) {
    const note = this.noteRepo.create({
      ...input,
      user_id: userId,
      bg_image: savePath || null,
    });
    return await this.noteRepo.save(note);
  }

  async addFiles(ref_id: number, type: string, url: string) {
    const files = await this.storageRepo.create({
      ref_id,
      type,
      url,
    });
    return await this.storageRepo.save(files);
  }

  // async getNotes(userId: number) {
  //   return await this.noteRepo.find({
  //     where: { user_id: userId },
  //     relations: ['files', 'noteLabels', 'noteLabels.label'],
  //     order: { created_at: 'DESC' },
  //   });
  // }

  async updateNote(
    noteId: number,
    userId: number,
    data: UpdateNotesInput,
  ): Promise<Note | null> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, user_id: userId, deleted_at: IsNull() },
    });

    if (!note) return null;

    // make a shallow copy of input
    const updateData = { ...data };

    delete updateData.reminder_at;
    delete updateData.is_reminder;
    delete updateData.is_archived;

    updateData.is_edited = true;
    updateData.edited_at = new Date();

    if (data.reminder_at !== undefined) {
      if (data.reminder_at) {
        note.reminder_at = data.reminder_at;
        note.is_reminder = true;
      } else {
        note.reminder_at = null;
        note.is_reminder = false;
      }
    }

    if (data.is_archived === true) {
      note.is_archived = true;
      note.archived_at = new Date();
    } else if (data.is_archived === false) {
      note.is_archived = false;
      note.archived_at = null;
    }

    Object.assign(note, updateData);

    return this.noteRepo.save(note);
  }

  async deleteOrRestoreNote(
    userId: number,
    noteId: number,
  ): Promise<'deleted' | 'restored' | null> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, user_id: userId },
    });

    if (!note) return null;

    if (note.deleted_at) {
      note.deleted_at = null;
      await this.noteRepo.save(note);
      return 'restored';
    } else {
      note.deleted_at = new Date();
      await this.noteRepo.save(note);
      return 'deleted';
    }
  }

  // async toggleArchiveStatus(
  //   noteId: number,
  //   userId: number,
  // ): Promise<Note | null> {
  //   const note = await this.noteRepo.findOne({
  //     where: { id: noteId, user_id: userId },
  //   });
  //   if (!note) return null;
  //   if (note.is_archived == true) {
  //     note.is_archived = false;
  //     note.archived_at = null;
  //   } else {
  //     note.is_archived = true;
  //     note.archived_at = new Date();
  //   }
  //   return this.noteRepo.save(note);
  // }

  // async setReminder(
  //   userId: number,
  //   noteId: number,
  //   reminderAt: Date | null,
  // ): Promise<Note | null> {
  //   const note = await this.noteRepo.findOne({
  //     where: { id: noteId, user_id: userId, deleted_at: IsNull() },
  //   });

  //   if (!note) return null;

  //   note.is_reminder = !!reminderAt;
  //   note.reminder_at = reminderAt;

  //   return await this.noteRepo.save(note);
  // }

  async getArchivedOrTrashedNotesOrReminder(
    type: string | null,
    query: string | null,
    userId: number,
  ): Promise<Note[]> {
    if (query) {
      return await this.noteRepo.find({
        where: {
          user_id: userId,
          deleted_at: IsNull(),
          title: ILike(`%${query}%`),
        },
        relations: ['files', 'noteLabels', 'noteLabels.label'],
        order: { updated_at: 'DESC' },
      });
    }
    if (type === 'archive') {
      return await this.noteRepo.find({
        where: {
          user_id: userId,
          is_archived: true,
          deleted_at: IsNull(),
        },
        relations: ['files', 'noteLabels', 'noteLabels.label'],
        order: { updated_at: 'DESC' },
      });
    }

    if (type === 'trash') {
      return await this.noteRepo.find({
        where: {
          user_id: userId,
          deleted_at: Not(IsNull()),
        },
        relations: ['files', 'noteLabels', 'noteLabels.label'],
        order: { deleted_at: 'DESC' },
      });
    }

    if (type === 'reminder') {
      return await this.noteRepo.find({
        where: {
          user_id: userId,
          is_reminder: true,
          reminder_at: Not(IsNull()),
          deleted_at: IsNull(),
        },
        relations: ['files', 'noteLabels', 'noteLabels.label'],
        order: { reminder_at: 'ASC' },
      });
    }

    return await this.noteRepo.find({
      where: { user_id: userId, deleted_at: IsNull(), is_archived: false },
      relations: ['files', 'noteLabels', 'noteLabels.label'],
      order: { created_at: 'DESC' },
    });
  }

  async emptyTrash(userId: number): Promise<number> {
    const trashedNotes = await this.noteRepo.find({
      where: {
        user_id: userId,
        deleted_at: Not(IsNull()),
      },
    });

    const noteIds = trashedNotes.map((note) => note.id);

    if (noteIds.length === 0) return 0;

    const result = await this.noteRepo.delete(noteIds);
    return result.affected ?? 0;
  }

  async getNotesByLabelId(userId: number, labelId: number) {
    return await this.noteRepo
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.noteLabels', 'noteLabel')
      .leftJoinAndSelect('noteLabel.label', 'label')
      .leftJoinAndSelect('note.files', 'files')
      .where('note.user_id = :userId', { userId })
      .andWhere('note.deleted_at IS NULL')
      .andWhere('label.id = :labelId', { labelId })
      .orderBy('note.created_at', 'DESC')
      .getMany();
  }
  // async searchNotes(userId: number, query: string): Promise<Note[]> {
  //   return await this.noteRepo.find({
  //     where: [
  //       {
  //         user_id: userId,
  //         deleted_at: IsNull(),
  //         title: ILike(`%${query}%`),
  //       },
  //       {
  //         user_id: userId,
  //         deleted_at: IsNull(),
  //         description: ILike(`%${query}%`),
  //       },
  //     ],
  //     order: { updated_at: 'DESC' },
  //   });
  // }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/entities/notes.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { AddNotesInput, UpdateNotesInput } from './notes.type';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
  ) {}

  async createNote(userId: number, input: AddNotesInput): Promise<Note> {
    const note = this.noteRepo.create({ ...input, user_id: userId });
    return await this.noteRepo.save(note);
  }

  async getNotes(userId: number): Promise<Note[]> {
    return this.noteRepo.find({ where: { user_id: userId } });
  }

  async updateNote(
    noteId: number,
    userId: number,
    data: UpdateNotesInput,
  ): Promise<Note | null> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, user_id: userId },
    });

    if (!note) return null;

    const updateData = { ...data };
    updateData.is_edited = true;
    updateData.edited_at = new Date();

    Object.assign(note, updateData);

    return this.noteRepo.save(note);
  }

  async deleteNote(userId: number, noteId: number): Promise<boolean> {
    const result = await this.noteRepo.update(
      { id: noteId },
      { deleted_at: new Date() },
    );

    if (typeof result.affected === 'number' && result.affected > 0) {
      return true;
    }

    return false;
  }

  async restoreNote(userId: number, noteId: number): Promise<boolean> {
    const result = await this.noteRepo.update(
      { user_id: userId, id: noteId },
      { deleted_at: null },
    );

    return typeof result.affected === 'number' && result.affected > 0;
  }

  async toggleArchiveStatus(
    noteId: number,
    userId: number,
  ): Promise<Note | null> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, user_id: userId },
    });
    if (!note) return null;
    if (note.is_archived == true) {
      note.is_archived = false;
      note.archived_at = null;
    } else {
      note.is_archived = true;
      note.archived_at = new Date();
    }
    return this.noteRepo.save(note);
  }

  async setReminder(
    userId: number,
    noteId: number,
    reminderAt: Date | null,
  ): Promise<Note | null> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, user_id: userId, deleted_at: IsNull() },
    });

    if (!note) return null;

    note.is_reminder = !!reminderAt;
    note.reminder_at = reminderAt;

    return await this.noteRepo.save(note);
  }

  async getArchivedOrTrashedNotesOrReminder(
    type: string,
    userId: number,
  ): Promise<Note[]> {
    if (type === 'archive') {
      return await this.noteRepo.find({
        where: {
          user_id: userId,
          is_archived: true,
          deleted_at: IsNull(),
        },
        order: { updated_at: 'DESC' },
      });
    }

    if (type === 'trash') {
      return await this.noteRepo.find({
        where: {
          user_id: userId,
          deleted_at: Not(IsNull()),
        },
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
        order: { reminder_at: 'ASC' },
      });
    }

    throw new Error('Invalid type. Expected "archive" or "trash".');
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

  async searchNotes(userId: number, query: string): Promise<Note[]> {
    return await this.noteRepo.find({
      where: [
        {
          user_id: userId,
          deleted_at: IsNull(),
          title: ILike(`%${query}%`),
        },
        {
          user_id: userId,
          deleted_at: IsNull(),
          description: ILike(`%${query}%`),
        },
      ],
      order: { updated_at: 'DESC' },
    });
  }
}

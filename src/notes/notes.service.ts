import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/entities/notes.entity';
import { Repository } from 'typeorm';
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

  async deleteNote(userId: number, noteId: number): Promise<string> {
    await this.noteRepo.delete({ user_id: userId, id: noteId });
    return 'true';
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
}

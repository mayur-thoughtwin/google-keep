// src/modules/notes/notes.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/entities/notes.entity';
import { Repository } from 'typeorm';
import { AddNotesInput } from './notes.type';

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
    data: Partial<AddNotesInput>,
  ): Promise<Note | null> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, user_id: userId },
    });
    if (!note) return null;

    Object.assign(note, data);
    return this.noteRepo.save(note);
  }

  async deleteNote(userId: number, noteId: number): Promise<string> {
    await this.noteRepo.delete({ user_id: userId, id: noteId });
    return 'true';
  }
}

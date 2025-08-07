/* eslint-disable @typescript-eslint/unbound-method */
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { Note } from 'src/entities/notes.entity';
import {
  AddNotesInput,
  ArchiveNoteInput,
  UpdateNotesInput,
} from './notes.type';
import { NotesService } from './notes.service';
import { GenericResponse } from 'src/common/types/generic-response.type';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { handleResponse } from 'src/common/utils/reponse';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Resolver(() => Note)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  // @Mutation(() => GenericResponse)
  // @UseGuards(GraphQLJwtAuthGuard)
  // async addNotes(
  //   @Args('notes') notes: AddNotesInput,
  //   @CurrentUser() user: any,
  // ) {
  //   try {
  //     const created = await this.notesService.createNote(
  //       user.userId as number,
  //       notes,
  //     );
  //     return handleResponse({
  //       success: true,
  //       message: 'Note created',
  //       data: created,
  //     });
  //   } catch (error) {
  //     return handleResponse({
  //       success: false,
  //       message: 'Failed to create note',
  //       data: error,
  //     });
  //   }
  // }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async createNote(
    @Args('createNoteInput') createNoteInput: AddNotesInput,
    @Args('file', { type: () => GraphQLUpload }) file: Promise<FileUpload>,
    @CurrentUser() user: any,
  ) {
    const { createReadStream, filename } = await file;
    const savePath = join(process.cwd(), 'uploads', filename);

    await new Promise<void>((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(savePath))
        .on('finish', () => resolve())
        .on('error', (err) => reject(err));
    });

    // Debug logs (optional)
    console.log('Saved:', savePath);
    console.log('User:', user);

    return handleResponse({
      success: true,
      message: 'Note created and file uploaded',
      data: {
        ...createNoteInput,
        filePath: `uploads/${filename}`,
      },
    });
  }
  @Query(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async getNotes(@CurrentUser() user: any) {
    try {
      const result = await this.notesService.getNotes(user.userId as number);
      return handleResponse({
        success: true,
        message: 'Notes fetched',
        data: result,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to fetch notes',
        data: error,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async updateNote(
    @Args('noteId') noteId: number,
    @Args('data') data: UpdateNotesInput,
    @CurrentUser() user: any,
  ) {
    try {
      const updated = await this.notesService.updateNote(
        noteId,
        user.userId as number,
        data,
      );
      if (!updated) {
        return handleResponse({
          success: false,
          message: 'Note not found',
          data: null,
        });
      }
      return handleResponse({
        success: true,
        message: 'Note updated',
        data: updated,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to update note',
        data: error,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async deleteNote(
    @Args('noteId') noteId: number,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const success = await this.notesService.deleteNote(
        user.userId as number,
        noteId,
      );

      if (!success) {
        return handleResponse({
          success: false,
          message: 'Note not found',
          data: null,
        });
      }

      return handleResponse({
        success: true,
        message: 'Note deleted',
        data: null,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to delete note',
        data: error.message ?? error,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async archiveNote(
    @Args('input') input: ArchiveNoteInput,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const updated = await this.notesService.toggleArchiveStatus(
        input.noteId,
        user.userId as number,
      );

      if (!updated) {
        return handleResponse({
          success: false,
          message: 'Note not found',
          data: null,
        });
      }

      return handleResponse({
        success: true,
        message: updated.is_archived ? 'Note archived' : 'Note unarchived',
        data: updated,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to toggle archive status',
        data: error,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async restoreNote(
    @Args('noteId') noteId: number,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const success = await this.notesService.restoreNote(
        user.userId as number,
        noteId,
      );

      if (!success) {
        return handleResponse({
          success: false,
          message: 'Note not found or already active',
          data: null,
        });
      }

      return handleResponse({
        success: true,
        message: 'Note restored successfully',
        data: null,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to restore note',
        data: error.message ?? error,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async setReminder(
    @Args('noteId') noteId: number,
    @Args('reminderAt', { type: () => Date, nullable: true }) reminderAt: Date,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const updatedNote = await this.notesService.setReminder(
        user.userId as number,
        noteId,
        reminderAt ?? null,
      );

      if (!updatedNote) {
        return handleResponse({
          success: false,
          message: 'Note not found or already deleted',
          data: null,
        });
      }

      return handleResponse({
        success: true,
        message: reminderAt ? 'Reminder set successfully' : 'Reminder removed',
        data: updatedNote,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to update reminder',
        data: error.message,
      });
    }
  }

  @Query(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async getArchiveOrTrashNotesOrReminder(
    @Args('type') type: string,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const notes = await this.notesService.getArchivedOrTrashedNotesOrReminder(
        type,
        user.userId as number,
      );

      return handleResponse({
        success: true,
        message: `Fetched ${type} notes successfully`,
        data: notes,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to fetch notes',
        data: error.message ?? error,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async emptyTrash(@CurrentUser() user: any): Promise<GenericResponse> {
    try {
      const deletedCount = await this.notesService.emptyTrash(
        user.userId as number,
      );

      if (deletedCount === 0) {
        return handleResponse({
          success: true,
          message: 'Trash is already empty',
          data: null,
        });
      }

      return handleResponse({
        success: true,
        message: `Permanently deleted ${deletedCount} notes from trash`,
        data: deletedCount,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to empty trash',
        data: error.message,
      });
    }
  }

  @Query(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async searchNotes(
    @Args('query') query: string,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const notes = await this.notesService.searchNotes(
        user.userId as number,
        query,
      );

      return handleResponse({
        success: true,
        message: 'Search results fetched',
        data: notes,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Search failed',
        data: error.message,
      });
    }
  }
}

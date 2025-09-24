/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/unbound-method */
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Param, UseGuards } from '@nestjs/common';
import { GraphQLJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { Note } from 'src/entities/notes.entity';
import { AddNotesInput, UpdateNotesInput, NotesResponse } from './notes.type';
import { NotesService } from './notes.service';
import { GenericResponse } from 'src/common/types/generic-response.type';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { handleResponse } from 'src/common/utils/reponse';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
// import { createWriteStream } from 'fs';
// import { join } from 'path';
import {
  saveUploadedFile,
  saveMultipleUploadedFiles,
} from 'src/common/utils/file.upload.util';
import { CloudinaryService } from 'src/common/services/cloudinary.service';

@Resolver(() => Note)
export class NotesResolver {
  constructor(
    private readonly notesService: NotesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async createNote(
    @CurrentUser() user: any,
    @Args('createNoteInput') createNoteInput: AddNotesInput,
    @Args('label', { type: () => String, nullable: true }) label?: string,
    @Args('bg_image', { type: () => GraphQLUpload, nullable: true })
    bg_image?: FileUpload,
    @Args('images', { type: () => [GraphQLUpload], nullable: true })
    images?: FileUpload[],
  ) {
    let savePath: string | null = null;

    if (bg_image) {
      savePath = await saveUploadedFile(
        Promise.resolve(bg_image),
        this.cloudinaryService,
      );
    }

    const note = await this.notesService.createNote(
      user.userId as number,
      createNoteInput,
      savePath,
    );

    if (images?.length) {
      const imagePromises = images.map((img) => Promise.resolve(img));
      const imageUrls = await saveMultipleUploadedFiles(
        imagePromises,
        this.cloudinaryService,
      );
      for (const imageUrl of imageUrls) {
        await this.notesService.addFiles(note.id, 'image', imageUrl);
      }
    }

    return handleResponse({
      success: true,
      message: 'Note created successfully',
      data: {
        ...note,
        bg_image: savePath,
      },
    });
  }

  // @Query(() => NotesResponse)
  // @UseGuards(GraphQLJwtAuthGuard)
  // async getNotes(@CurrentUser() user: any) {
  //   try {
  //     const result = await this.notesService.getNotes(user.userId as number);
  //     return {
  //       notes: result,
  //     };
  //   } catch (error) {
  //     throw new Error('Failed to fetch notes');
  //   }
  // }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async updateNote(
    @Args('noteId') noteId: number,
    @Args('data') data: UpdateNotesInput,
    @CurrentUser() user: any,
    @Args('bg_image', { type: () => GraphQLUpload, nullable: true })
    bg_image?: FileUpload,
    @Args('images', { type: () => [GraphQLUpload], nullable: true })
    images?: FileUpload[],
  ) {
    try {
      let savePath: string | null = null;

      if (bg_image) {
        savePath = await saveUploadedFile(
          Promise.resolve(bg_image),
          this.cloudinaryService,
        );
        data.bg_image = savePath;
      }

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

      if (images?.length) {
        const imagePromises = images.map((img) => Promise.resolve(img));
        const imageUrls = await saveMultipleUploadedFiles(
          imagePromises,
          this.cloudinaryService,
        );
        for (const imageUrl of imageUrls) {
          await this.notesService.addFiles(updated.id, 'image', imageUrl);
        }
      }

      return handleResponse({
        success: true,
        message: 'Note updated successfully',
        data: updated,
      });
    } catch (error) {
      console.error(error);
      return handleResponse({
        success: false,
        message: 'Failed to update note',
        data: error.message || error,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async deleteOrRestoreNote(
    @Args('noteId') noteId: number,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const result = await this.notesService.deleteOrRestoreNote(
        user.userId as number,
        noteId,
      );

      if (!result) {
        return handleResponse({
          success: false,
          message: 'Note not found',
          data: null,
        });
      }

      return handleResponse({
        success: true,
        message:
          result === 'deleted'
            ? 'Note deleted successfully'
            : 'Note restored successfully',
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to delete/restore note',
        data: error.message ?? error,
      });
    }
  }

  // @Mutation(() => GenericResponse)
  // @UseGuards(GraphQLJwtAuthGuard)
  // async archiveNote(
  //   @Args('noteId') noteId: number,
  //   @CurrentUser() user: any,
  // ): Promise<GenericResponse> {
  //   try {
  //     const updated = await this.notesService.toggleArchiveStatus(
  //       noteId,
  //       user.userId as number,
  //     );

  //     if (!updated) {
  //       return handleResponse({
  //         success: false,
  //         message: 'Note not found',
  //         data: null,
  //       });
  //     }

  //     return handleResponse({
  //       success: true,
  //       message: updated.is_archived ? 'Note archived' : 'Note unarchived',
  //       data: updated,
  //     });
  //   } catch (error) {
  //     return handleResponse({
  //       success: false,
  //       message: 'Failed to toggle archive status',
  //       data: error,
  //     });
  //   }
  // }

  // @Mutation(() => GenericResponse)
  // @UseGuards(GraphQLJwtAuthGuard)
  // async restoreNote(
  //   @Args('noteId') noteId: number,
  //   @CurrentUser() user: any,
  // ): Promise<GenericResponse> {
  //   try {
  //     const success = await this.notesService.restoreNote(
  //       user.userId as number,
  //       noteId,
  //     );

  //     if (!success) {
  //       return handleResponse({
  //         success: false,
  //         message: 'Note not found or already active',
  //         data: null,
  //       });
  //     }

  //     return handleResponse({
  //       success: true,
  //       message: 'Note restored successfully',
  //       data: null,
  //     });
  //   } catch (error) {
  //     return handleResponse({
  //       success: false,
  //       message: 'Failed to restore note',
  //       data: error.message ?? error,
  //     });
  //   }
  // }

  // @Mutation(() => GenericResponse)
  // @UseGuards(GraphQLJwtAuthGuard)
  // async setReminder(
  //   @Args('noteId') noteId: number,
  //   @Args('reminderAt', { type: () => Date, nullable: true }) reminderAt: Date,
  //   @CurrentUser() user: any,
  // ): Promise<GenericResponse> {
  //   try {
  //     const updatedNote = await this.notesService.setReminder(
  //       user.userId as number,
  //       noteId,
  //       reminderAt ?? null,
  //     );

  //     if (!updatedNote) {
  //       return handleResponse({
  //         success: false,
  //         message: 'Note not found or already deleted',
  //         data: null,
  //       });
  //     }

  //     return handleResponse({
  //       success: true,
  //       message: reminderAt ? 'Reminder set successfully' : 'Reminder removed',
  //     });
  //   } catch (error) {
  //     return handleResponse({
  //       success: false,
  //       message: 'Failed to update reminder',
  //       data: error.message,
  //     });
  //   }
  // }

  @Query(() => NotesResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async getNotes(
    @Args('type', { type: () => String, nullable: true }) type: string,
    @Args('query', { type: () => String, nullable: true }) query: string,
    @CurrentUser() user: any,
  ): Promise<NotesResponse> {
    try {
      const result =
        await this.notesService.getArchivedOrTrashedNotesOrReminder(
          type ?? null,
          query ?? null,
          user.userId as number,
        );

      return { notes: result };
    } catch (error) {
      throw new Error('Failed to fetch notes');
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
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to empty trash',
        data: error.message,
      });
    }
  }
  // removed bg_image
  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async removeBgFromNote(
    @Args('noteId') noteId: number,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const updated = await this.notesService.updateNote(
        noteId,
        user.userId as number,
        {
          bg_image: null,
        },
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
        message: 'Background image removed successfully',
        data: updated,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to remove background image',
        data: error.message || error,
      });
    }
  }

  // remove image from storage
  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async removeImageFromNote(
    @Args('fileId') fileId: number,
    @Args('noteId') noteId: number,
    @CurrentUser() user: any,
  ): Promise<GenericResponse> {
    try {
      const success = await this.notesService.removeFile(fileId, noteId);

      if (!success) {
        return handleResponse({
          success: false,
          message: 'File not found',
          data: null,
        });
      }

      return handleResponse({
        success: true,
        message: 'Image removed successfully',
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to remove image',
        data: error.message || error,
      });
    }
  }
  // @Query(() => GenericResponse)
  // @UseGuards(GraphQLJwtAuthGuard)
  // async searchNotes(
  //   @Args('query') query: string,
  //   @CurrentUser() user: any,
  // ): Promise<GenericResponse> {
  //   try {
  //     const notes = await this.notesService.searchNotes(
  //       user.userId as number,
  //       query,
  //     );

  //     return handleResponse({
  //       success: true,
  //       message: 'Search results fetched',
  //       data: notes,
  //     });
  //   } catch (error) {
  //     return handleResponse({
  //       success: false,
  //       message: 'Search failed',
  //       data: error.message,
  //     });
  //   }
  // }
  @Query(() => NotesResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async getNotesByLabelId(
    @Args('labelId') labelId: number,
    @CurrentUser() user: any,
  ): Promise<NotesResponse> {
    try {
      const notes = await this.notesService.getNotesByLabelId(
        user.userId as number,
        labelId,
      );
      return { notes: notes ?? [] };
    } catch (error) {
      console.error(error);
      return { notes: [] };
    }
  }
}

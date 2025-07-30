import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { Note } from 'src/entities/notes.entity';
import { AddNotesInput } from './notes.type';
import { NotesService } from './notes.service';
import { GenericResponse } from 'src/common/types/generic-response.type';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { handleResponse } from 'src/utils/reponse';

@Resolver(() => Note)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async addNotes(
    @Args('notes') notes: AddNotesInput,
    @CurrentUser() user: any,
  ) {
    try {
      const created = await this.notesService.createNote(
        user.userId as number,
        notes,
      );
      return handleResponse({
        success: true,
        message: 'Note created',
        data: created,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to create note',
        data: error,
      });
    }
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
    @Args('data') data: AddNotesInput,
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
  async deleteNote(@Args('noteId') noteId: number, @CurrentUser() user: any) {
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
        data: error,
      });
    }
  }
}

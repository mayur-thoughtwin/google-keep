import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { Label } from 'src/entities/labels.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GenericResponse } from 'src/common/types/generic-response.type';
import { handleResponse } from 'src/common/utils/reponse';
import { AddLabelInput } from './label.type';
import { LabelsService } from './label.service';

@Resolver(() => Label)
export class LabelsResolver {
  constructor(private readonly labelsService: LabelsService) {} // ✅ FIXED

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async addLabel(
    @Args('label') label: AddLabelInput,
    @CurrentUser() user: any,
  ) {
    try {
      const created = await this.labelsService.createLabel(
        user.userId as number,
        label,
      );
      return handleResponse({
        success: true,
        message: 'Label created',
        data: created,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: error,
        // data: error,
      });
    }
  }

  @Query(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async getLabels(@CurrentUser() user: any) {
    try {
      const result = await this.labelsService.getLabels(user.userId as number);
      return handleResponse({
        success: true,
        message: 'Labels fetched',
        data: result,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to fetch labels',
        data: error,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async updateLabel(
    @Args('labelId') labelId: number,
    @Args('data') data: AddLabelInput,
    @CurrentUser() user: any,
  ) {
    try {
      const updated = await this.labelsService.updateLabel(
        labelId,
        user.userId as number,
        data,
      );

      if (!updated) {
        return handleResponse({
          success: false,
          message: 'Label not found',
          //   data: null,
        });
      }

      return handleResponse({
        success: true,
        message: 'Label updated successfully',
        data: updated,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: error.message || 'Failed to update label',
        // data: null,
      });
    }
  }

  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async deleteLabel(
    @Args('labelId') labelId: number,
    @CurrentUser() user: any,
  ) {
    try {
      const success = await this.labelsService.deleteLabel(
        user.userId as number,
        labelId,
      );
      if (success !== 'true') {
        return handleResponse({
          success: false,
          message: 'Label not found',
        });
      }
      return handleResponse({
        success: true,
        message: 'Label deleted',
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to delete label',
        data: error,
      });
    }
  }
}

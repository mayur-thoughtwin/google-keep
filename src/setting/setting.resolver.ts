import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { handleResponse } from 'src/common/utils/reponse';
import { UpdateSettingsInput } from './setting.type';
import { GenericResponse } from 'src/common/types/generic-response.type';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GraphQLJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { Settings } from 'src/entities/settings.entity';
import { SettingsService } from './setting.service';

@Resolver(() => Settings)
export class SettingResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Query(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  getSettings(@CurrentUser() user: any) {
    try {
      const result = this.settingsService.getSettings(user.userId as number);
      return handleResponse({
        success: true,
        message: 'Data fetched',
        data: result,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to update settings',
        data: error,
      });
    }
  }
  @Mutation(() => GenericResponse)
  @UseGuards(GraphQLJwtAuthGuard)
  async updateSettings(
    @Args('settings') settings: UpdateSettingsInput,
    @CurrentUser() user: any,
  ) {
    try {
      await this.settingsService.updateSettings(
        user.userId as number,
        settings,
      );
      return handleResponse({
        success: true,
        message: 'Settings updated successfully',
        // data: updated,
      });
    } catch (error) {
      return handleResponse({
        success: false,
        message: 'Failed to update settings',
        data: error,
      });
    }
  }
}

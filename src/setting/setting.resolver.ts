import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

@Resolver()
export class SettingResolver {
  @Query(() => String)
  getSettings() {
    return 'Settings data';
  }
  @Mutation(() => String)
  updateSettings(@Args('newSettings') newSettings: string) {
    // Logic to update settings
    return `Settings updated to: ${newSettings}`;
  }
}

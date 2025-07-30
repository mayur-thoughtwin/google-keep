import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSettingsInput {
  @Field()
  is_new_item_at_bottom?: boolean;

  @Field()
  is_display_rich?: boolean;

  @Field()
  is_checked_item_at_bottom?: boolean;

  @Field()
  is_dark_theme?: boolean;

  @Field()
  is_sharing?: boolean;
}

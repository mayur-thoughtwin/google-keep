import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UpdateSettingsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'is_new_item_at_bottom must be a boolean value' })
  is_new_item_at_bottom?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'is_display_rich must be a boolean value' })
  is_display_rich?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'is_checked_item_at_bottom must be a boolean value' })
  is_checked_item_at_bottom?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'is_dark_theme must be a boolean value' })
  is_dark_theme?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'is_sharing must be a boolean value' })
  is_sharing?: boolean;
}

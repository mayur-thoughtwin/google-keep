import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddNotesInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  bg_color?: string;

  @Field({ nullable: true })
  bg_image?: string;

  @Field({ defaultValue: false })
  is_archived: boolean;

  @Field({ nullable: true })
  archived_at?: Date;

  @Field({ nullable: true })
  is_edited: boolean;

  @Field({ nullable: true })
  edited_at?: Date;

  @Field({ nullable: true })
  is_reminder: boolean;

  @Field({ nullable: true })
  reminder_at?: Date;

  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  deleted_at?: Date;
}

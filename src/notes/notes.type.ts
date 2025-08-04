import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsNumber,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class AddNotesInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 5, { message: 'Title must be between 1 and 5 characters long' })
  title?: string;

  @Field()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bg_color?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bg_image?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  is_archived: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  archived_at?: Date;

  @Field({ defaultValue: false })
  @IsBoolean()
  is_edited: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  edited_at?: Date;

  @Field({ defaultValue: false })
  @IsBoolean()
  is_reminder: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  reminder_at?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deleted_at?: Date;
}

@InputType()
export class ArchiveNoteInput {
  @Field()
  @Type(() => Number)
  @IsNumber()
  noteId: number;
}
@InputType()
export class UpdateNotesInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bg_color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bg_image?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_archived?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  archived_at?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_edited?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  edited_at?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_reminder?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  reminder_at?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deleted_at?: Date;
}

@InputType()
export class SetReminderInput {
  @Field()
  @IsNumber()
  noteId: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  reminder_at?: Date;
}

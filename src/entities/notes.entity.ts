/* eslint-disable @typescript-eslint/no-unsafe-return */
// note.entity.ts
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Storage } from './storage.entity';
import { NoteLabels } from './note.labels.entity';

@ObjectType()
@Entity('notes')
export class Note {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  user_id: number;

  @Field()
  @Column({ length: 100 })
  title: string;

  @Field()
  @Column('text')
  description: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  bg_color: string;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  bg_image: string | null;

  @Field()
  @Column()
  is_archived: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  archived_at: Date | null;

  @Field()
  @Column()
  is_edited: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  edited_at: Date | null;

  @Field()
  @Column()
  is_reminder: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  reminder_at: Date | null;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  latitude: number;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  longitude: number;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Field(() => [Storage], { nullable: true })
  @OneToMany(() => Storage, (storage) => storage.note)
  files: Storage[];

  @Field(() => [NoteLabels], { nullable: true })
  @OneToMany(() => NoteLabels, (noteLabels) => noteLabels.note)
  noteLabels: NoteLabels[];

  @Field(() => [String], { nullable: true })
  get labelNames(): string[] {
    return this.noteLabels?.map((nl) => nl.label?.name).filter(Boolean) || [];
  }
}

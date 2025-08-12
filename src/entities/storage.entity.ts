/* eslint-disable @typescript-eslint/no-unsafe-return */
// storage.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Note } from './notes.entity';

@ObjectType()
@Entity('storage')
export class Storage {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  ref_id: number;

  @Field()
  @Column({ length: 10 })
  type: string;

  @Field()
  @Column('text')
  url: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Note, (note) => note.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ref_id' })
  note: Note;
}

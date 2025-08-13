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
import { Label } from './labels.entity';

@ObjectType()
@Entity('note_labels')
export class NoteLabels {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  note_id: number;

  @Field(() => Int)
  @Column()
  label_id: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Note, (note) => note.noteLabels)
  @JoinColumn({ name: 'note_id' })
  note: Note;

  @ManyToOne(() => Label, (label) => label.noteLabels)
  @JoinColumn({ name: 'label_id' })
  label: Label;

  @Field(() => String, { nullable: true })
  get labelName(): string | null {
    return this.label?.name || null;
  }
}

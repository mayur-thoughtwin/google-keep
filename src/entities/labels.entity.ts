import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { NoteLabels } from './note.labels.entity';

@ObjectType()
@Entity('labels')
export class Label {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  user_id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Field(() => [NoteLabels], { nullable: true })
  @OneToMany(() => NoteLabels, (noteLabels) => noteLabels.label)
  noteLabels: NoteLabels[];
}

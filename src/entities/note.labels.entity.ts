import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('note_labels')
export class NoteLabels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  note_id: number;

  @Column()
  label_id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('labels')
export class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notes_id: number;

  @Column({ length: 50 })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

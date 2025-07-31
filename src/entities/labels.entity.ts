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
  user_id: number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

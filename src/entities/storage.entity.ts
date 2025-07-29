import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('storage')
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ref_id: number;

  @Column({ length: 10 })
  type: string;

  @Column('text')
  url: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

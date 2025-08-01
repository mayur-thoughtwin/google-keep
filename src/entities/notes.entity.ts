import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  bg_color: string;

  @Column('text', { nullable: true })
  bg_image: string;

  @Column()
  is_archived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  archived_at: Date | null;

  @Column()
  is_edited: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  edited_at: Date;

  @Column()
  is_reminder: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  reminder_at: Date | null;

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  is_new_item_at_bottom: boolean;

  @Column()
  is_display_rich: boolean;

  @Column()
  is_checked_item_at_bottom: boolean;

  @Column()
  is_dark_theme: boolean;

  @Column()
  is_sharing: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

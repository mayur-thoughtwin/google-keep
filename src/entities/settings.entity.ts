/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity('settings')
export class Settings {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  user_id: number;

  @Field(() => Boolean)
  @Column()
  is_new_item_at_bottom: boolean;

  @Field(() => Boolean)
  @Column()
  is_display_rich: boolean;

  @Field(() => Boolean)
  @Column()
  is_checked_item_at_bottom: boolean;

  @Field(() => Boolean)
  @Column()
  is_dark_theme: boolean;

  @Field(() => Boolean)
  @Column()
  is_sharing: boolean;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (user) => user.settings, { onDelete: 'CASCADE' })
  user: User;
}

@ObjectType()
export class SettingsResponse {
  @Field(() => Settings, { nullable: true })
  settings: Settings | null;
}

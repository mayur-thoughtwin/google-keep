import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Settings } from './settings.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 50, unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleId: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  picture: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToOne(() => Settings, (settings) => settings.user, {
    onDelete: 'CASCADE',
  })
  settings: Settings;
}

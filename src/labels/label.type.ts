import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class AddLabelInput {
  @Field()
  @IsString({ message: 'Name must be a string' })
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters' })
  name: string;
}

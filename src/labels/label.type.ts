import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddLabelInput {
  @Field()
  name: string;
}

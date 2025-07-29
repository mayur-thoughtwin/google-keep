import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createUserDto {
  @Field()
  email: string;
}

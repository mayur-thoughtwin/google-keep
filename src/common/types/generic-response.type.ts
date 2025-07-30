import { ObjectType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class GenericResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  timestamp: string;

  @Field(() => GraphQLJSON, { nullable: true })
  data?: Record<string, any>;
}

import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class GenericResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  timestamp: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  data?: Record<string, any>;
}

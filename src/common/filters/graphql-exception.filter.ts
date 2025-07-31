/* eslint-disable @typescript-eslint/no-unused-vars */
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    return {
      success: false,
      message: exception?.message || 'Something went wrong',
      timestamp: new Date().toISOString(),
    };
  }
}

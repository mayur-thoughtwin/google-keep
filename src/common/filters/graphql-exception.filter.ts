import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      const messageArray = (response as any).message;
      let message: string;

      if (Array.isArray(messageArray)) {
        message = messageArray.join('; ');
      } else {
        message = messageArray || 'Validation error';
      }

      return {
        success: false,
        message,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: false,
      message: exception?.message || 'Something went wrong',
      timestamp: new Date().toISOString(),
    };
  }
}

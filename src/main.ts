import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  app.useGlobalFilters(new GraphQLExceptionFilter());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // app.useGlobalPipes(GlobalValidationPipe);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

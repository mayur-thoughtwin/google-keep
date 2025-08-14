import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // app.useGlobalFilters(new GraphQLExceptionFilter());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // app.useGlobalPipes(GlobalValidationPipe);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

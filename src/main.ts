import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 1 }));

  // console.log(as)
  // console.log(as.graphqlUploadExpress);

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

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GraphQLExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

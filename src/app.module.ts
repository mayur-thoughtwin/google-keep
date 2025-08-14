/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './db/db.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserResolver } from './user/user.resolver';
import { entities } from './entities';
import { AuthModule } from './auth/auth.module';
import { SettingModule } from './setting/setting.module';
import { NotesModule } from './notes/notes.module';
import { LabelsModule } from './labels/label.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { Upload, UploadScalar } from './common/scalar/upload.scalar';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature(entities),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // uploads: {
      //   maxFileSize: 10000000, // 10 MB
      //   maxFiles: 1,
      // },
      uploads: false,
      playground: true,
      context: ({ req }) => ({ req }),
    } as any),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    //   serveRoot: '/uploads',
    // }),
    AuthModule,
    SettingModule,
    NotesModule,
    LabelsModule,
  ],
  controllers: [],
  providers: [UserResolver],
})
export class AppModule {}

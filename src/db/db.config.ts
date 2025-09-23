// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { User } from '../entities/user.entity';
// import { Settings } from '../entities/settings.entity';
// import { Note } from '../entities/notes.entity';
// import { Storage } from '../entities/storage.entity';
// import { Label } from '../entities/labels.entity';
// import { DataSource } from 'typeorm';
// import { NoteLabels } from 'src/entities/note.labels.entity';
// import * as dotenv from 'dotenv';
// dotenv.config();
// export const typeOrmConfig = (
//   configService: ConfigService,
// ): TypeOrmModuleOptions => ({
//   type: 'postgres',
//   host: configService.get('DB_HOST') ?? 'localhost',
//   port: +(configService.get<number>('DB_PORT') ?? 5432),
//   username: configService.get('DB_USERNAME') ?? 'postgres',
//   password: configService.get('DB_PASSWORD') ?? '',
//   database: configService.get('DB_NAME') ?? 'postgres',
//   entities: [User, Settings, Note, Storage, Label, NoteLabels],
//   synchronize: true,
// });

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432', 10),
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_DATABASE || 'postgres',
//   entities: [User, Settings, Note, Storage, Label, NoteLabels],
//   migrations: ['src/migrations/*.ts'],
// });

// orm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Settings } from '../entities/settings.entity';
import { Note } from '../entities/notes.entity';
import { Storage } from '../entities/storage.entity';
import { Label } from '../entities/labels.entity';
import { NoteLabels } from '../entities/note.labels.entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [User, Settings, Note, Storage, Label, NoteLabels],
  synchronize: true, // ⚠️ turn this off in prod, use migrations instead
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Settings, Note, Storage, Label, NoteLabels],
  migrations: ['src/migrations/*.ts'],
  ssl: { rejectUnauthorized: false },
});

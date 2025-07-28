import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Settings } from '../entities/settings.entity';
import { Note } from '../entities/notes.entity';
import { Storage } from '../entities/storage.entity';
import { Label } from '../entities/labels.entity';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST') ?? 'localhost',
  port: +(configService.get<number>('DB_PORT') ?? 5432),
  username: configService.get('DB_USERNAME') ?? 'postgres',
  password: configService.get('DB_PASSWORD') ?? '',
  database: configService.get('DB_NAME') ?? 'postgres',
  entities: [User, Settings, Note, Storage, Label],
  synchronize: true, // Set to false in production!
}); 
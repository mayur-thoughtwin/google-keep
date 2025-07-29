require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  // Deprecated: use src/db/db.config.ts (AppDataSource) for CLI
  cli: {
    migrationsDir: 'src/migrations',
  },
}; 
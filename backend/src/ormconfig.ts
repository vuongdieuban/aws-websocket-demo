import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionEntity } from './database/entities/Transaction.entity';

export const typeormConfigOptions: TypeOrmModuleOptions = {
  synchronize: false,
  dropSchema: false,
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'demo',
  logging: true,
  entities: ['src/database/entities/**/*.entity.ts'],
  migrationsTableName: 'migration',
  migrations: ['src/database/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

export const seedsConfigOptions: TypeOrmModuleOptions = {
  ...typeormConfigOptions,
  name: 'seeds',
  migrationsTableName: 'seeds_migrations',
  migrations: ['src/database/seeds/*.ts'],
  cli: {
    migrationsDir: 'src/database/seeds',
  },
};

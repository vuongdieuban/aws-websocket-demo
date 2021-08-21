import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfigOptions: TypeOrmModuleOptions = {
  synchronize: false,
  dropSchema: false,
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'rxjs-demo',
  logging: true,
  entities: ['dist/**/*.entity.js'],

  migrationsTableName: 'migration',
  migrations: ['dist/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

export const seedsConfigOptions: TypeOrmModuleOptions = {
  ...typeormConfigOptions,
  name: 'seeds',
  migrationsTableName: 'seeds_migrations',
  migrations: ['dist/database/seeds/*.js'],
  cli: {
    migrationsDir: 'src/database/seeds',
  },
};

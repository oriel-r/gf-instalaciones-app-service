import { DataSource, DataSourceOptions } from "typeorm";
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from "@nestjs/config";

dotenvConfig({ path: '.env.development.local' });

const sqlitedataSourceConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DB_NAME_SQLITE as string,
  key: process.env.DB_PASSWORD_SQLITE,
  synchronize: true,
  dropSchema: true,
  logging: ['error'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
}

export const sqlitedbConfig = registerAs(
    'sqlite',
    () => sqlitedataSourceConfig,
);

export const appDataSourceSql = new DataSource(sqlitedataSourceConfig)
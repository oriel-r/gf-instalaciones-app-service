import { DataSource, DataSourceOptions } from "typeorm";
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from "@nestjs/config";

dotenvConfig({ path: '.env.development.local' });

const sqlitedataSourceConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DB_NAME as string,
  key: process.env.DB_PASSWORD,
  synchronize: true,
  dropSchema: true,
  logging: ['error'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
}

export const dbConfig = registerAs(
    'sqlite',
    () => sqlitedataSourceConfig,
);

export const appDataSource = new DataSource(sqlitedataSourceConfig)
import { DataSource, DataSourceOptions } from "typeorm";
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from "@nestjs/config";

dotenvConfig({ path: '.env.development.local' });

const isCloud = process.env.ENVIRONMENT === 'CLOUD';

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: isCloud ? process.env.DB_HOST_CLOUD : process.env.DB_HOST_LOCAL,
  port: parseInt(isCloud ? process.env.DB_PORT_CLOUD! : process.env.DB_PORT_LOCAL!),
  username: isCloud ? process.env.DB_USERNAME_CLOUD : process.env.DB_USERNAME_LOCAL,
  password: isCloud ? process.env.DB_PASSWORD_CLOUD : process.env.DB_PASSWORD_LOCAL,
  database: isCloud ? process.env.DB_NAME_CLOUD : process.env.DB_NAME_LOCAL,
  synchronize: true,
  dropSchema: false,
  logging: ['error'],
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
}

export const dbConfig = registerAs(
    'postgres',
    () => dataSourceConfig,
);

export const appDataSource = new DataSource(dataSourceConfig)

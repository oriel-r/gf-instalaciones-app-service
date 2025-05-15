import { DataSource, DataSourceOptions } from "typeorm";
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from "@nestjs/config";

dotenvConfig({ path: '.env.development.local' });

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME_PSQL,
  host: process.env.DB_HOST_PSQL,
  port: parseInt(process.env.DB_PORT_PSQL as string),
  username: process.env.DB_USERNAME_PSQL,
  password: process.env.DB_PASSWORD_PSQL,
  synchronize: true,
  dropSchema: true,
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

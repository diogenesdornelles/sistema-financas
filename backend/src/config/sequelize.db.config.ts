import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const DB_PORT = process.env.DB_PORT || 5432;
const HOST = process.env.HOST || 'localhost';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || '';

export const sequelize = new Sequelize(
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  {
    host: HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: false,
  },
);

import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  Cat,
  Cf,
  Cp,
  Cr,
  Partner,
  Tcf,
  Tcp,
  Tcr,
  Tx,
  User,
} from '../entity/entities.js';

dotenv.config();

const DB_PORT = process.env.DB_PORT || 5433;
const HOST = process.env.HOST || '';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || '';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: HOST,
  port: DB_PORT as number,
  username: POSTGRES_USER as string,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  synchronize: false, // usado para produção, com migrações
  logging: false,
  entities: [User, Tcf, Tcp, Tcr, Cat, Cf, Cp, Cr, Partner, Tx],
  migrations: ['src/migrations/forTypeorm/*.ts'],
  subscribers: [],
  migrationsTableName: 'migrations',
});

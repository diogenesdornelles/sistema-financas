import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  User,
  Tcf,
  Tcp,
  Tcr,
  Cat,
  Cf,
  Cp,
  Cr,
  Partner,
  Tx,
} from "../entity/entities";
import * as dotenv from "dotenv";

dotenv.config();

const DB_PORT = process.env.DB_PORT || 3307;
const HOST = process.env.HOST || "";
const MYSQL_USER = process.env.MYSQL_USER || "root";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: HOST,
  port: DB_PORT as number,
  username: MYSQL_USER as string,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Tcf, Tcp, Tcr, Cat, Cf, Cp, Cr, Partner, Tx],
  migrations: [],
  subscribers: [],
});

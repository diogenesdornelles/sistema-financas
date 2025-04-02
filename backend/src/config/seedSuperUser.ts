import { User } from "../entity/entities";
import hashPassword from "../utils/hash-pwd.util";
import { AppDataSource } from "./db";
import * as dotenv from "dotenv";

dotenv.config();

const CPF = process.env.SUPER_CPF;
const PWD = process.env.SUPER_PWD;

export const seedSuperUser = async () => {
  const userRepository = AppDataSource.getRepository(User);

  const existingUser = await userRepository.findOne({ where: { cpf: CPF } });

  if (existingUser) {
    console.log("Superusuário já existe.");
    return;
  }

  const pwdHash = await hashPassword(PWD as string);

  const user = userRepository.create({
    name: "super",
    surname: "admin",
    cpf: CPF,
    pwd: pwdHash,
  });

  await userRepository.save(user);
  console.log("Superusuário criado com sucesso.");
};

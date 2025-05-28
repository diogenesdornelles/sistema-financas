import { User } from "../../entity/entities";
import hashPassword from "../../utils/hashPwd.util";
import { AppDataSource } from "../../config/typeorm.db.config";
import * as dotenv from "dotenv";
import { RoleType } from "@monorepo/packages";

dotenv.config();

export const createSeedSuperUser = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const CPF = process.env.SUPER_CPF;
  const PWD = process.env.SUPER_PWD;

  const existingUser = await userRepository.findOne({ where: { cpf: CPF } });

  if (existingUser) {
    console.log("Superusuário já existe.");
    return;
  }

  const pwdHash = await hashPassword(PWD as string);
  const user = userRepository.create({
    name: "super",
    surname: "admin",
    role: RoleType.ADMIN,
    cpf: CPF,
    pwd: pwdHash,
  });

  await userRepository.save(user);
  console.log("Superusuário criado com sucesso.");
};
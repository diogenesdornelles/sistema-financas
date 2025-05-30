import { AppDataSource } from "../../config/typeorm.db.config.js";
import { User } from "../../entity/entities.js";
import hashPassword from "../../utils/hashPwd.util.js";
import { usersSeed } from "../dataSeed/usersSeed.js";

export const createSeedUser = async () => {
  const userRepository = AppDataSource.getRepository(User);

  usersSeed.forEach(async (userData) => {
    const existingUser = await userRepository.findOne({
      where: { cpf: userData.cpf },
    });

    if (existingUser) {
      console.log(`Usuário já existe: ${userData.name} ${userData.surname}`);
      return;
    }

    const pwdHash = await hashPassword(userData.pwd as string);
    const user = userRepository.create({
      name: userData.name,
      role: userData.role,
      surname: userData.surname,
      cpf: userData.cpf,
      pwd: pwdHash,
    });

    await userRepository.save(user);
    console.log(
      `Usuário criado com sucesso: ${userData.name} ${userData.surname}`,
    );
  });
};

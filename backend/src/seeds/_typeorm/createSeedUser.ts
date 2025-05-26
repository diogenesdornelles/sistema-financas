import { User } from "../../entity/entities";
import hashPassword from "../../utils/hash-pwd.util";
import { AppDataSource } from "../../config/typeorm.db.config";
import { usersSeed } from "../dataSeed/usersSeed";

export const createSeedUser = async () => {
  const userRepository = AppDataSource.getRepository(User);

  usersSeed.forEach(async (userData) => {
    const existingUser = await userRepository.findOne({ where: { cpf: userData.cpf } });

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
    console.log(`Usuário criado com sucesso: ${userData.name} ${userData.surname}`);
  });
};

import { Partner, User } from "../../entity/entities";
import { AppDataSource } from "../../config/typeorm.db.config";
import { partnersSeed } from "../dataSeed/partnersSeed";
import * as dotenv from "dotenv";

dotenv.config();

export const createSeedPartner = async () => {
  const partnerRepo = AppDataSource.getRepository(Partner);
  const userRepo = AppDataSource.getRepository(User);
  const CPF = process.env.SUPER_CPF;

  const existingUser = await userRepo.findOne({ where: { cpf: CPF } });

  if (!existingUser) {
    console.log("Superusuário não existe.");
    return;
  }

  partnersSeed.forEach(async (data) => {
    const existing = await partnerRepo.findOne({ where: { cod: data.cod } });

    if (existing) {
      console.log(
        `Dado já existe: ${data.cod} em ${partnerRepo.metadata.name}`,
      );
      return;
    }

    const newData = partnerRepo.create({
      name: data.name,
      cod: data.cod,
      type: data.type,
      obs: data.obs,
      user: existingUser,
    });

    await partnerRepo.save(newData);
    console.log(
      `Dado salvo com sucesso: ${data.cod} em ${partnerRepo.metadata.name}`,
    );
  });
};

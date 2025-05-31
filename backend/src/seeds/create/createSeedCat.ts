import * as dotenv from 'dotenv';
import { AppDataSource } from '../../config/typeorm.db.config.js';
import { Cat, User } from '../../entity/entities.js';
import { catsSeed } from '../dataSeed/catsSeed.js';

dotenv.config();

export const createSeedCat = async () => {
  const catRepo = AppDataSource.getRepository(Cat);
  const userRepo = AppDataSource.getRepository(User);
  const CPF = process.env.SUPER_CPF;

  const existingUser = await userRepo.findOne({ where: { cpf: CPF } });

  if (!existingUser) {
    console.log('Superusuário não existe.');
    return;
  }

  catsSeed.forEach(async (data) => {
    const existing = await catRepo.findOne({ where: { name: data.name } });

    if (existing) {
      console.log(`Dado já existe: ${data.name} em ${catRepo.metadata.name}`);
      return;
    }

    const newData = catRepo.create({
      name: data.name,
      description: data.description,
      obs: data.obs,
      user: existingUser,
    });

    await catRepo.save(newData);
    console.log(
      `Dado salvo com sucesso: ${data.name} em ${catRepo.metadata.name}`,
    );
  });
};

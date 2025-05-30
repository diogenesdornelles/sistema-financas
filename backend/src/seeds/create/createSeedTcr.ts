import { AppDataSource } from "../../config/typeorm.db.config.js";
import { Tcr } from "../../entity/entities.js";
import { tcrsSeed } from "../dataSeed/tcrsSeed.js";

export const createSeedTcr = async () => {
  const repo = AppDataSource.getRepository(Tcr);

  tcrsSeed.forEach(async (data) => {
    const existing = await repo.findOne({ where: { name: data.name } });

    if (existing) {
      console.log(`Dado já existe: ${data.name}`);
      return;
    }

    const newData = repo.create({
      name: data.name,
    });

    await repo.save(newData);
    console.log(
      `Dado salvo com sucesso: ${data.name} em ${repo.metadata.name}`,
    );
  });
};

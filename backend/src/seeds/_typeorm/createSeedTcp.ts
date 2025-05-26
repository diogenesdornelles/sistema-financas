import { Tcp } from "../../entity/entities";
import { AppDataSource } from "../../config/typeorm.db.config";
import { tcpsSeed } from "../dataSeed/tcpsSeed";

export const createSeedTcp = async () => {
  const repo = AppDataSource.getRepository(Tcp);

  tcpsSeed.forEach(async (data) => {
    const existing = await repo.findOne({ where: { name: data.name } });

    if (existing) {
      console.log(`Dado já existe: ${data.name} em ${repo.metadata.name}`);
      return;
    }

    const newData = repo.create({
      name: data.name,
    });

    await repo.save(newData);
    console.log(`Dado salvo com sucesso: ${data.name} em ${repo.metadata.name}`);
  });
};

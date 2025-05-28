import { Tcf } from "../../entity/entities";
import { AppDataSource } from "../../config/typeorm.db.config";
import { tcfsSeed } from "../dataSeed/tcfsSeed";

export const createSeedTcf = async () => {
  const repo = AppDataSource.getRepository(Tcf);

  tcfsSeed.forEach(async (data) => {
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

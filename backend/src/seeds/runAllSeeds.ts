import { SeedManager } from "./SeedManager";
import { createSeedSuperUser } from "./_typeorm/createSeedSuperUser";
import { createSeedUser } from "./_typeorm/createSeedUser";
import { createSeedPartner } from "./_typeorm/createSeedPartner";
import { createSeedTcr } from "./_typeorm/createSeedTcr";
import { createSeedCat } from "./_typeorm/createSeedCat";
import { createSeedTcf } from "./_typeorm/createSeedTcf";
import { createSeedTcp } from "./_typeorm/createSeedTcp";

export const runAllSeeds = async () => {
  const seedManager = new SeedManager();

  await seedManager.runSeed("1-super-user", createSeedSuperUser);
  await seedManager.runSeed("2-users", createSeedUser);
  await seedManager.runSeed("3-partners", createSeedPartner);
  await seedManager.runSeed("4-tcrs", createSeedTcr);
  await seedManager.runSeed("5-cats", createSeedCat);
  await seedManager.runSeed("6-tcps", createSeedTcp);
  await seedManager.runSeed("7-tcrs", createSeedTcf);
};

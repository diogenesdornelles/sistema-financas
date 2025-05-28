import { SeedManager } from "./SeedManager";
import { createSeedSuperUser } from "./create/createSeedSuperUser";
import { createSeedUser } from "./create/createSeedUser";
import { createSeedPartner } from "./create/createSeedPartner";
import { createSeedTcr } from "./create/createSeedTcr";
import { createSeedCat } from "./create/createSeedCat";
import { createSeedTcf } from "./create/createSeedTcf";
import { createSeedTcp } from "./create/createSeedTcp";

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

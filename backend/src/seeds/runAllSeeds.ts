import { SeedManager } from "./SeedManager.js";
import { createSeedCat } from "./create/createSeedCat.js";
import { createSeedPartner } from "./create/createSeedPartner.js";
import { createSeedSuperUser } from "./create/createSeedSuperUser.js";
import { createSeedTcf } from "./create/createSeedTcf.js";
import { createSeedTcp } from "./create/createSeedTcp.js";
import { createSeedTcr } from "./create/createSeedTcr.js";
import { createSeedUser } from "./create/createSeedUser.js";

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

import { AppDataSource } from "../config/typeorm.db.config";

export class SeedManager {
  private async createSeedTable() {
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS "seeds_executed" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "executedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_seeds_executed" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_seeds_name" UNIQUE ("name")
      )
    `);
  }

  private async isSeedExecuted(seedName: string): Promise<boolean> {
    const result = await AppDataSource.query(
      `SELECT COUNT(*) as count FROM "seeds_executed" WHERE "name" = $1`,
      [seedName]
    );
    return parseInt(result[0].count) > 0;
  }

  private async markSeedAsExecuted(seedName: string) {
    await AppDataSource.query(
      `INSERT INTO "seeds_executed" ("name") VALUES ($1)`,
      [seedName]
    );
  }

  async runSeed(seedName: string, seedFunction: () => Promise<void>) {
    await this.createSeedTable();
    
    if (await this.isSeedExecuted(seedName)) {
      console.log(`Seed '${seedName}' já foi executado.`);
      return;
    }

    console.log(`Executando seed '${seedName}'...`);
    await seedFunction();
    await this.markSeedAsExecuted(seedName);
    console.log(`Seed '${seedName}' executado com sucesso.`);
  }
}
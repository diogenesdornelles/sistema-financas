import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrationTIMESTAMP implements MigrationInterface {
  name = `InitialMigration-${new Date().getTime()}`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'migrations');`,
    );

    if (result[0].exists) {
      console.log("Initial migration already applied, skipping...");
      return;
    }

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Verificar e criar ENUMs apenas se não existirem
    const cpStatusExists = await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cp_status_enum');`,
    );
    if (!cpStatusExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "cp_status_enum" AS ENUM('pending', 'paid', 'cancelled')`,
      );
    }

    const crStatusExists = await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cr_status_enum');`,
    );
    if (!crStatusExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "cr_status_enum" AS ENUM('pending', 'paid', 'cancelled')`,
      );
    }

    const txTypeExists = await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tx_type_enum');`,
    );
    if (!txTypeExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "tx_type_enum" AS ENUM('entry', 'outflow')`,
      );
    }

    const partnerTypeExists = await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partner_type_enum');`,
    );
    if (!partnerTypeExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "partner_type_enum" AS ENUM('PJ', 'PF')`,
      );
    }

    const roleTypeExists = await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type_enum');`,
    );
    if (!roleTypeExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "role_type_enum" AS ENUM('admin', 'manager', 'analist', 'assistant')`,
      );
    }

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(30) NOT NULL,
        "role" "role_type_enum" NOT NULL,
        "surname" character varying(60) NOT NULL,
        "cpf" character varying(11) NOT NULL,
        "pwd" character varying(128) NOT NULL,
        "status" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_user_cpf" UNIQUE ("cpf"),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tcf" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(40) NOT NULL,
        "status" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_tcf_name" UNIQUE ("name"),
        CONSTRAINT "PK_tcf_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tcp" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(40) NOT NULL,
        "status" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_tcp_name" UNIQUE ("name"),
        CONSTRAINT "PK_tcp_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tcr" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(40) NOT NULL,
        "status" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_tcr_name" UNIQUE ("name"),
        CONSTRAINT "PK_tcr_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "partner" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(100) NOT NULL,
        "type" "partner_type_enum" NOT NULL,
        "cod" character varying(20) NOT NULL,
        "status" boolean NOT NULL DEFAULT true,
        "obs" text,
        "userId" uuid,
        CONSTRAINT "UQ_partner_cod" UNIQUE ("cod"),
        CONSTRAINT "PK_partner_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cat" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(100) NOT NULL,
        "description" text,
        "status" boolean NOT NULL DEFAULT true,
        "obs" text,
        "userId" uuid,
        CONSTRAINT "UQ_cat_name" UNIQUE ("name"),
        CONSTRAINT "PK_cat_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "firstBalance" numeric(15,2) NOT NULL DEFAULT '0'::numeric,
        "currentBalance" numeric(15,2) NOT NULL DEFAULT '0'::numeric,
        "number" character varying(10) NOT NULL,
        "ag" character varying(10),
        "bank" character varying(30),
        "obs" text,
        "status" boolean NOT NULL DEFAULT true,
        "tcfId" uuid,
        "userId" uuid,
        CONSTRAINT "PK_cf_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cp" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "value" numeric(15,2) NOT NULL,
        "due" date NOT NULL,
        "obs" text,
        "status" "cp_status_enum" NOT NULL DEFAULT 'pending',
        "tcpId" uuid,
        "supplierId" uuid,
        "userId" uuid,
        CONSTRAINT "PK_cp_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cr" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "value" numeric(15,2) NOT NULL,
        "due" date NOT NULL,
        "obs" text,
        "status" "cr_status_enum" NOT NULL DEFAULT 'pending',
        "tcrId" uuid,
        "customerId" uuid,
        "userId" uuid,
        CONSTRAINT "PK_cr_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tx" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "value" numeric(15,2) NOT NULL,
        "type" "tx_type_enum" NOT NULL,
        "description" character varying(100) NOT NULL,
        "tdate" date NOT NULL,
        "obs" text,
        "status" boolean NOT NULL DEFAULT true,
        "cfId" uuid,
        "cpId" uuid,
        "crId" uuid,
        "userId" uuid,
        "catId" uuid,
        CONSTRAINT "PK_tx_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cat" ADD CONSTRAINT "FK_cat_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cf" ADD CONSTRAINT "FK_cf_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cf" ADD CONSTRAINT "FK_cf_tcfId" FOREIGN KEY ("tcfId") REFERENCES "tcf"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cp" ADD CONSTRAINT "FK_cp_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cp" ADD CONSTRAINT "FK_cp_tcpId" FOREIGN KEY ("tcpId") REFERENCES "tcp"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cp" ADD CONSTRAINT "FK_cp_supplierId" FOREIGN KEY ("supplierId") REFERENCES "partner"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cr" ADD CONSTRAINT "FK_cr_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cr" ADD CONSTRAINT "FK_cr_tcrId" FOREIGN KEY ("tcrId") REFERENCES "tcr"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cr" ADD CONSTRAINT "FK_cr_customerId" FOREIGN KEY ("customerId") REFERENCES "partner"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "partner" ADD CONSTRAINT "FK_partner_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" ADD CONSTRAINT "FK_tx_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" ADD CONSTRAINT "FK_tx_catId" FOREIGN KEY ("catId") REFERENCES "cat"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" ADD CONSTRAINT "FK_tx_cfId" FOREIGN KEY ("cfId") REFERENCES "cf"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" ADD CONSTRAINT "FK_tx_cpId" FOREIGN KEY ("cpId") REFERENCES "cp"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" ADD CONSTRAINT "FK_tx_crId" FOREIGN KEY ("crId") REFERENCES "cr"("id") ON DELETE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" DROP CONSTRAINT "FK_tx_crId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" DROP CONSTRAINT "FK_tx_cpId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" DROP CONSTRAINT "FK_tx_cfId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" DROP CONSTRAINT "FK_tx_catId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "tx" DROP CONSTRAINT "FK_tx_userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "partner" DROP CONSTRAINT "FK_partner_userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cr" DROP CONSTRAINT "FK_cr_customerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cr" DROP CONSTRAINT "FK_cr_tcrId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cr" DROP CONSTRAINT "FK_cr_userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cp" DROP CONSTRAINT "FK_cp_supplierId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cp" DROP CONSTRAINT "FK_cp_tcpId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cp" DROP CONSTRAINT "FK_cp_userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cf" DROP CONSTRAINT "FK_cf_tcfId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cf" DROP CONSTRAINT "FK_cf_userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE IF EXISTS "cat" DROP CONSTRAINT "FK_cat_userId"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "tx"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cr"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cp"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cf"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cat"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "partner"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tcr"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tcp"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tcf"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "partner_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tx_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "cr_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "cp_status_enum"`);
  }
}

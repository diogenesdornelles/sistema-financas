import { Between, QueryRunner, Repository } from "typeorm";
import { AppDataSource } from "../config/typeorm.db.config";
import {
  DbBalanceProps,
  ResultSet,
  DbCpsCrsProps,
} from "../../../packages/dtos/db.dto";
import { Cp, Cr } from "../entity/entities";
import { ApiError } from "../utils/api-error.util";

export class DbService {
  public queryRunner: QueryRunner;
  public crRepo: Repository<Cr>;
  public cpRepo: Repository<Cp>;

  constructor() {
    this.queryRunner = AppDataSource.createQueryRunner();
    this.crRepo = AppDataSource.getRepository(Cr);
    this.cpRepo = AppDataSource.getRepository(Cp);
  }

  /**
   * Recupera saldos das contas ativas.
   - Pegar cada CF em TX (distinct);
   - somar valores onde CR é null (Saída);
   - somar valores onde CP é null (Entrada);
   - diminuir as somas;
   - até a data informada;
   - devolver CF com campo saldo atual
   *
   * @param date - Data limite. Desconsidera transações do dia atual.
   */
  public getBalances = async (date: string): Promise<DbBalanceProps | null> => {
    try {
      const result: ResultSet[] = await this.queryRunner.manager.query(
        `SELECT DISTINCT
            ttx."cfId" AS "cfId",
            tcf."number" AS "cfNumber",
            tcf."firstBalance" AS "firstBalance",
            tcf."currentBalance" AS "currentBalance",
            COALESCE(SUM(ttx."value") FILTER (WHERE ttx."cpId" IS NULL), 0) AS "totalEntry",
            COALESCE(SUM(ttx."value") FILTER (WHERE ttx."crId" IS NULL), 0) AS "totalOutflow"
          FROM tx ttx
          INNER JOIN cf tcf ON tcf."id" = ttx."cfId"
          WHERE ttx."tdate" <= $1 AND ttx."status" = true
          GROUP BY ttx."cfId", tcf."number", tcf."firstBalance", tcf."currentBalance";`,
        [date],
      );

      if (result) {
        return {
          result,
          date,
        };
      }
      return null;
    } catch (error) {
      throw new Error(`Erro ao recuperar balanços com data ${date}: ${error}`);
    }
  };
  /**
   * Recupera CR e CP dentro de um intervalo.
   *
   * @param date - Data limite. Desconsidera transações do dia atual.
   */
  public getCpsCrs = async (
    date: string = new Date().toISOString(),
  ): Promise<DbCpsCrsProps | null> => {
    const currentDate = new Date();
    const targetDate = new Date(date);

    if (currentDate > targetDate) {
      throw new ApiError(401, "Data deve ser maior ou igual que a atual");
    }

    const cps = await this.cpRepo.find({
      where: { due: Between(currentDate, targetDate) },
      select: {
        id: true,
        value: true,
        due: true,
        status: true,
        createdAt: false,
        updatedAt: false,
        obs: false,
      },
      relations: { type: true, supplier: true },
    });

    const crs = await this.crRepo.find({
      where: { due: Between(currentDate, targetDate) },
      select: {
        id: true,
        value: true,
        due: true,
        status: true,
        createdAt: false,
        updatedAt: false,
        obs: false,
      },
      relations: { type: true, customer: true },
    });

    return { cps, crs } as unknown as DbCpsCrsProps;
  };
}

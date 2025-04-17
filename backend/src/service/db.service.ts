import { QueryRunner } from "typeorm";
import { AppDataSource } from "../config/db";
import { DbBalanceProps, ResultSet } from "../../../packages/dtos/db.dto";


export class DbService {
  public queryRunner: QueryRunner
  constructor() {
    this.queryRunner = AppDataSource.createQueryRunner();
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
        [date]
      );

      if (result) {
        return {
          result,
          date
        }
      }
      return null
    } catch (error) {
      throw new Error(`Erro ao recuperar balanços com data ${date}: ${error}`);
    }
  };

}

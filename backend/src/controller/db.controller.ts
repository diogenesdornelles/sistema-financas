import { Request, Response, NextFunction } from "express";
import { DbBalanceProps, DbCpsCrsProps } from "../../../packages/dtos/db.dto";
import { DbService } from "../service/db.service";

/**
 * Controla o fluxo de requisições e respostas de Dashboard
 *
 * @export
 * @class DbController
 */
export default class DbController {
  public service: DbService;
  /**
   * Creates an instance of DbController.
   * @memberof DbController
   */
  constructor() {
    this.service = new DbService();
  }

  /**
   * Gerencia a devolução de todos os balanços
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof DbController
   */
  public getBalances = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { date } = req.params;
      const items: DbBalanceProps | null = await this.service.getBalances(date);
      if (items) {
        res.status(200).json(items);
      } else {
        res.status(404).json({ message: "Balanços não encontrados" });
      }
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de contas  a pagar e a a receber um intervalo
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof DbController
   */
  public getCpsCrs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { date } = req.params;
      const items: DbCpsCrsProps | null = await this.service.getCpsCrs(date);
      if (items) {
        res.status(200).json(items);
      } else {
        res.status(404).json({ message: "Balanços não encontrados" });
      }
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

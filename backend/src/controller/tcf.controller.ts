import { Request, Response, NextFunction } from "express";
import { TcfService } from "../service/tcf.service";
import { BaseController } from "./base.controller";
import {
  queryTcfSchema,
  updateTcfSchema,
  createTcfSchema,
  UpdateTcf,
  CreateTcf,
  QueryTcf,
} from "@monorepo/packages";
import { Tcf } from "../entity/entities";

/**
 * Controla o fluxo de requisições e respostas de Tipo de contas
 *
 * @export
 * @class TcfController
 * @extends {BaseController<TcfService>}
 */
export default class TcfController extends BaseController<TcfService> {
  constructor() {
    super(new TcfService());
  }
  /**
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcfController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Tcf[] = await this.service.getAll();
      res.status(200).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcfController
   */
  public getMany = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { skip } = req.params;
      const skipInt = parseInt(skip);
      if (skipInt >= 0) {
        const items: Tcf[] | null = await this.service.getMany(skipInt);
        if (!items) {
          res.status(404).json({ message: "Tipo de contas não encontradas" });
          return;
        }
        res.status(200).json(items);
      } else {
        res
          .status(404)
          .json({ message: "Skip deve ser um número inteiro positivo" });
        return;
      }
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcfController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: Tcf | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: "Tipo conta não encontrada" });
        return;
      }
      res.status(200).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcfController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: CreateTcf = createTcfSchema.parse(req.body);
      const item: Tcf = await this.service.create(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcfController
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData: UpdateTcf = updateTcfSchema.parse(req.body);
      const updatedItem: Partial<Tcf> | null = await this.service.update(
        id,
        validatedData,
      );
      if (!updatedItem) {
        res.status(404).json({ message: "Tipo conta não encontrada" });
        return;
      }
      res.status(200).json(updatedItem);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcfController
   */
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const success: boolean = await this.service.delete(id);
      if (!success) {
        res.status(404).json({ message: "Tipo conta não encontrada" });
        return;
      }
      res.status(200).json({ message: "Tipo conta deletado!" });
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  /**
   * Gerencia a requição de uma busca profunda
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {*}  {Promise<void>}
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: QueryTcf = queryTcfSchema.parse(req.body);
      const item: Tcf[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

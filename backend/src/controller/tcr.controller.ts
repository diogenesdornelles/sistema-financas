import {
  CreateTcr,
  createTcrSchema,
  QueryTcr,
  queryTcrSchema,
  UpdateTcr,
  updateTcrSchema,
} from "@monorepo/packages";
import { NextFunction, Request, Response } from "express";
import { Tcr } from "../entity/entities.js";
import { TcrService } from "../service/tcr.service.js";
import { BaseController } from "./base.controller.js";

/**
 * Controla o fluxo de requisições e respostas de Tipo de contas
 *
 * @export
 * @class TcrController
 * @extends {BaseController<TcrService>}
 */
export default class TcrController extends BaseController<TcrService> {
  /**
   * Creates an instance of TcrController.
   * @memberof TcrController
   */
  constructor() {
    super(new TcrService());
  }
  /**
   * Controla o fluxo de requisições e respostas de Tipo de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcrController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Tcr[] = await this.service.getAll();
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
   * @memberof TcrController
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
        const items: Tcr[] | null = await this.service.getMany(skipInt);
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
   * Gerencia a devolução de um tipo de conta
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcrController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: Tcr | null = await this.service.getOne(id);
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
   * Gerencia a criação de um tipo de conta
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcrController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: CreateTcr = createTcrSchema.parse(req.body);
      const item: Tcr = await this.service.create(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a criação de um tipo de conta
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcrController
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData: UpdateTcr = updateTcrSchema.parse(req.body);
      const updatedItem: Partial<Tcr> | null = await this.service.update(
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
   * Gerencia a criação de um tipo de conta
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcrController
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
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcrController
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: QueryTcr = queryTcrSchema.parse(req.body);
      const item: Tcr[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

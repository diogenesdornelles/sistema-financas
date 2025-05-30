import {
  CreateCf,
  createCfSchema,
  GeneralValidator,
  QueryCf,
  queryCfSchema,
  UpdateCf,
  updateCfSchema,
} from "@monorepo/packages";
import { NextFunction, Request, Response } from "express";
import { Cf } from "../entity/entities.js";
import { CfService } from "../service/cf.service.js";
import { ApiError } from "../utils/apiError.util.js";
import { BaseController } from "./base.controller.js";

/**
 * Controla o fluxo de requisições e respostas de Contas financeiras
 *
 * @export
 * @class CfController
 * @extends {BaseController<CfService>}
 */
export default class CfController extends BaseController<CfService> {
  /**
   * Creates an instance of CfController.
   * @memberof CfController
   */
  constructor() {
    super(new CfService());
  }

  /**
   * Gerencia a devolução de todas as contas financeiras
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CfController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Cf[] = await this.service.getAll();
      res.status(200).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  /**
   * Gerencia a devolução algumas contas financeiras, de acordo com um skip
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CfController
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
        const items: Cf[] | null = await this.service.getMany(skipInt);
        if (!items) {
          res.status(404).json({ message: "Contas não encontradas" });
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
   * Gerencia a obtenção de uma conta financeira pelo ID
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CfController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: Cf | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: "Conta não encontrada" });
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
   * Gerencia a criação de uma conta, de acordo com o body
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CfController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { balance } = req.body;

      // Balance chega geralemnte como uma string monetária. Deve haver a normalização para uma string float.
      const normalizedBalance =
        GeneralValidator.validateAndNormalizeMoneyString(balance || "0.0");
      if (!normalizedBalance) {
        throw new ApiError(401, "Informar um valor Pt-Br válido");
      }

      // validação
      const validatedData: CreateCf = createCfSchema.parse({
        ...req.body,
        balance: normalizedBalance,
      });

      const cf = await this.service.create(validatedData);
      res.status(201).json(cf);
      return;
    } catch (error) {
      res.status(400).json({ error: error });
      return;
    }
  };

  /**
   * Gerencia a atualização de uma conta, de acordo com o id e o body
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CfController
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { balance } = req.body;

      // Balance chega geralemnte como uma string monetária. Deve haver a normalização para uma string float.
      if (balance) {
        const normalizedBalance =
          GeneralValidator.validateAndNormalizeMoneyString(balance);
        if (!normalizedBalance) {
          throw new ApiError(401, "Informar um valor Pt-Br válido");
        }
        req.body.balance = normalizedBalance;
      }

      const validatedData: UpdateCf = updateCfSchema.parse(req.body);

      const updatedCf = await this.service.update(id, validatedData);
      res.status(200).json(updatedCf);
      return;
    } catch (error) {
      res.status(400).json({ error: error });
      return;
    }
  };

  /**
   * Gerencia a deleção de uma conta pelo ID
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CfController
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
        res.status(404).json({ message: "Conta não encontrada" });
        return;
      }
      res.status(200).json({ message: "Conta deletada!" });
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
   * @memberof CfController
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { balance } = req.body;

      // Balance chega geralemnte como uma string monetária. Deve haver a normalização para uma string float.
      if (balance) {
        const normalizedBalance =
          GeneralValidator.validateAndNormalizeMoneyString(balance);
        if (!normalizedBalance) {
          throw new ApiError(401, "Informar um valor Pt-Br válido");
        }
        req.body.balance = normalizedBalance;
      }
      const validatedData: QueryCf = queryCfSchema.parse(req.body);
      const item: Cf[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

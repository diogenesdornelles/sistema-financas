import {
  CreateCp,
  createCpSchema,
  GeneralValidator,
  QueryCp,
  queryCpSchema,
  UpdateCp,
  updateCpSchema,
} from "@monorepo/packages";
import { NextFunction, Request, Response } from "express";
import { Cp } from "../entity/entities.js";
import { CpService } from "../service/cp.service.js";
import { ApiError } from "../utils/apiError.util.js";
import { BaseController } from "./base.controller.js";

/**
 * Controla o fluxo de requisições e respostas de Contas a pagar
 *
 * @export
 * @class CpController
 * @extends {BaseController<CpService>}
 */
export default class CpController extends BaseController<CpService> {
  /**
   * Creates an instance of CpController.
   * @memberof CpController
   */
  constructor() {
    super(new CpService());
  }

  /**
   * Gerencia a devolução de todas as contas a pagar
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CpController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Cp[] = await this.service.getAll();
      res.status(200).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  /**
   * Gerencia a devolução algumas contas a pagar, de acordo com um skip
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CpController
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
        const items: Cp[] | null = await this.service.getMany(skipInt);
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
   * Gerencia a obtenção de uma conta a pagar pelo ID
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CpController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: Cp | null = await this.service.getOne(id);
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
   * @memberof CpController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { value } = req.body;
      // normaliza string para float string
      const normalizedValue = GeneralValidator.validateAndNormalizeMoneyString(
        value || "",
      );

      if (!normalizedValue) {
        throw new ApiError(401, "Informar um valor Pt-Br válido");
      }

      const validatedData: CreateCp = createCpSchema.parse({
        ...req.body,
        value: normalizedValue,
      });
      const item: Cp = await this.service.create(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  /**
   * Gerencia a atualização de uma conta, de acordo com o id e o body
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CpController
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { value } = req.body;

      if (value) {
        // normaliza string para float string
        const normalizedValue =
          GeneralValidator.validateAndNormalizeMoneyString(value);
        if (!normalizedValue) {
          throw new ApiError(401, "Informar um valor Pt-Br válido");
        }
        req.body.value = normalizedValue;
      }
      const validatedData: UpdateCp = updateCpSchema.parse(req.body);
      const updateditem: Partial<Cp> | null = await this.service.update(
        id,
        validatedData,
      );
      if (!updateditem) {
        res.status(404).json({ message: "Conta não encontrada" });
        return;
      }
      res.status(200).json(updateditem);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  /**
   * Gerencia a deleção de uma conta pelo ID
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CpController
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
   * @memberof CpController
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { value } = req.body;
      // normaliza string para float string
      if (value) {
        const normalizedValue =
          GeneralValidator.validateAndNormalizeMoneyString(value);
        if (!normalizedValue) {
          throw new ApiError(401, "Informar um valor Pt-Br válido");
        }
        req.body.value = normalizedValue;
      }
      // validação
      const validatedData: QueryCp = queryCpSchema.parse(req.body);
      const item: Cp[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

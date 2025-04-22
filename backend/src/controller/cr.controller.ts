import { Request, Response, NextFunction } from "express";
import { CrService } from "../service/cr.service";
import { BaseController } from "./base.controller";
import { UpdateCr, CreateCr, QueryCr } from "../../../packages/dtos/cr.dto";
import { createCrSchema } from "../../../packages/validators/zod-schemas/create/create-cr.validator";
import { updateCrSchema } from "../../../packages/validators/zod-schemas/update/update-cr.validator";
import { queryCrSchema } from "../../../packages/validators/zod-schemas/query/query-cr.validator";
import { Cr } from "../entity/entities";
import GeneralValidator from "../../../packages/validators/general.validator";
import { ApiError } from "../utils/api-error.util";

/**
 * Controla o fluxo de requisições e respostas de Contas a pagar
 *
 * @export
 * @class CrController
 * @extends {BaseController<CrService>}
 */
export default class CrController extends BaseController<CrService> {
  /**
   * Creates an instance of CrController.
   * @memberof CrController
   */
  constructor() {
    super(new CrService());
  }

  /**
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CrController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Cr[] = await this.service.getAll();
      res.status(200).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  /**
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CrController
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
        const items: Cr[] | null = await this.service.getMany(skipInt);
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
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CrController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: Cr | null = await this.service.getOne(id);
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
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CrController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { value } = req.body;

      const normalizedValue = GeneralValidator.validateAndNormalizeMoneyString(
        value || "",
      );
      if (!normalizedValue) {
        throw new ApiError(401, "Informar um valor Pt-Br válido");
      }
      const validatedData: CreateCr = createCrSchema.parse({
        ...req.body,
        value: normalizedValue,
      });
      const item: Cr = await this.service.create(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  /**
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CrController
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
        const normalizedValue =
          GeneralValidator.validateAndNormalizeMoneyString(value);
        if (!normalizedValue) {
          throw new ApiError(401, "Informar um valor Pt-Br válido");
        }
        req.body.value = normalizedValue;
      }
      const validatedData: UpdateCr = updateCrSchema.parse(req.body);
      const updatedItem: Partial<Cr> | null = await this.service.update(
        id,
        validatedData,
      );
      if (!updatedItem) {
        res.status(404).json({ message: "Conta não encontrada" });
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
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CrController
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
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CrController
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { value } = req.body;

      if (value) {
        const normalizedValue =
          GeneralValidator.validateAndNormalizeMoneyString(value);
        if (!normalizedValue) {
          throw new ApiError(401, "Informar um valor Pt-Br válido");
        }
        req.body.value = normalizedValue;
      }
      const validatedData: QueryCr = queryCrSchema.parse(req.body);
      const item: Cr[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

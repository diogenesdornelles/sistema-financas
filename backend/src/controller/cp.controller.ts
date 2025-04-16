import { Request, Response, NextFunction } from "express";
import { CpService } from "../service/cp.service";
import { BaseController } from "./base.controller";
import { UpdateCp, CreateCp, QueryCp } from "../../../packages/dtos/cp.dto";
import { createCpSchema } from "../../../packages/validators/zod-schemas/create/create-cp.validator";
import { updateCpSchema } from "../../../packages/validators/zod-schemas/update/update-cp.validator";
import { queryCpSchema } from "../../../packages/validators/zod-schemas/query/query-cp.validator";
import { Cp } from "../entity/entities";
import GeneralValidator from "../../../packages/validators/general.validator";
import { ApiError } from "../utils/api-error.util";

export default class CpController extends BaseController<CpService> {
  constructor() {
    super(new CpService());
  }

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

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {

      const { value } = req.body;

      const normalizedValue = GeneralValidator.validateAndNormalizeMoneyString(value || "");

      if (!normalizedValue) {
        throw new ApiError(401, "Informar um valor Pt-Br válido");
      }
      
      const validatedData: CreateCp = createCpSchema.parse({ ...req.body, value: normalizedValue });
      const item: Cp = await this.service.create(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { value } = req.body;

      if (value) {
        const normalizedValue = GeneralValidator.validateAndNormalizeMoneyString(value);
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

  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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

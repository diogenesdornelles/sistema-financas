import { Request, Response, NextFunction } from "express";
import { CrService } from "../service/cr.service";
import { BaseController } from "./base.controller";
import { CrProps, UpdateCr, CreateCr, QueryCr } from "../../../packages/dtos/cr.dto";
import { createCrSchema } from "../../../packages/validators/zod-schemas/create/create-cr.validator";
import { updateCrSchema } from "../../../packages/validators/zod-schemas/update/update-cr.validator";
import { queryCrSchema } from "../../../packages/validators/zod-schemas/query/query-cr.validator";

export default class CrController extends BaseController<CrService> {
  constructor() {
    super(new CrService());
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: CrProps[] = await this.service.getAll();
      res.status(200).json(items);
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
      const item: CrProps | null = await this.service.getOne(id);
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
      const validatedData: CreateCr = createCrSchema.parse(req.body);
      const item: CrProps = await this.service.create(validatedData);
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
      const validatedData: UpdateCr = updateCrSchema.parse(req.body);
      const updatedItem: Partial<CrProps> | null = await this.service.update(
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
            const validatedData: QueryCr = queryCrSchema.parse(req.body);
            const item: CrProps[] = await this.service.query(validatedData);
            res.status(201).json(item);
            return;
          } catch (error) {
            next(error);
            return;
          }
        };
}

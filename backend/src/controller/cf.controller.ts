import { Request, Response, NextFunction } from "express";
import { CfService } from "../service/cf.service";
import { BaseController } from "./base.controller";
import { UpdateCf, CreateCf } from "../../../packages/dtos/cf.dto";
import { createCfSchema } from "../../../packages/validators/zod-schemas/create/create-cf.validator";
import { updateCfSchema } from "../../../packages/validators/zod-schemas/update/update-cf.validator";
import { QueryCat } from "../../../packages/dtos/cat.dto";
import { queryCfSchema } from "../../../packages/validators/zod-schemas/query/query-cf.validator";
import { Cf } from "../entity/entities";

export default class CfController extends BaseController<CfService> {
  constructor() {
    super(new CfService());
  }

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

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      console.log(req.body)
      const validatedData: CreateCf = createCfSchema.parse(req.body);
      const item: Cf = await this.service.create(validatedData);
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
      const validatedData: UpdateCf = updateCfSchema.parse(req.body);
      const updateditem: Partial<Cf> | null = await this.service.update(
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
      const validatedData: QueryCat = queryCfSchema.parse(req.body);
      const item: Cf[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

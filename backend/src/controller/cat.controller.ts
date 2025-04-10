import { Request, Response, NextFunction } from "express";
import { CatService } from "../service/cat.service";
import { BaseController } from "./base.controller";
import { UpdateCat, CreateCat, QueryCat } from "../../../packages/dtos/cat.dto";
import { createCatSchema } from "../../../packages/validators/zod-schemas/create/create-cat.validator";
import { updateCatSchema } from "../../../packages/validators/zod-schemas/update/update-cat.validator";
import { queryCatSchema } from "../../../packages/validators/zod-schemas/query/query-cat.validator";
import { Cat } from "../entity/entities";

export default class CatController extends BaseController<CatService> {
  constructor() {
    super(new CatService());
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Cat[] = await this.service.getAll();
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
        const items: Cat[] | null = await this.service.getMany(skipInt);
        if (!items) {
          res.status(404).json({ message: "Categorias não encontradas" });
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
      const item: Cat | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: "Categoria não encontrada" });
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
      const validatedData: CreateCat = createCatSchema.parse(req.body);
      const item: Cat = await this.service.create(validatedData);
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
      const validatedData: UpdateCat = updateCatSchema.parse(req.body);
      const updatedItem: Partial<Cat> | null = await this.service.update(
        id,
        validatedData,
      );
      if (!updatedItem) {
        res.status(404).json({ message: "Categoria não encontrada" });
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
        res.status(404).json({ message: "Categoria não encontrada" });
        return;
      }
      res.status(200).json({ message: "Categoria deletada!" });
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
      const validatedData: QueryCat = queryCatSchema.parse(req.body);
      const item: Cat[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

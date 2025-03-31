import { Request, Response, NextFunction } from "express";
import { CatService } from "../service/cat.service";
import { BaseController } from "./base.controller";
import {
  CatResponseDto,
  UpdateCatDto,
  CreateCatDto,
} from "../dtos/cat.dto";
import { createCatSchema } from "../validator/create/create-cat.validator";
import { updateCatSchema } from "../validator/update/update-cat.validator";

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
      const items: CatResponseDto[] = await this.service.getAll();
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
      const item: CatResponseDto | null = await this.service.getOne(id);
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
      const validatedData: CreateCatDto = createCatSchema.parse(req.body);
      const item: CatResponseDto = await this.service.create(validatedData);
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
      const validatedData: UpdateCatDto = updateCatSchema.parse(req.body);
      const updatedItem: Partial<CatResponseDto> | null =
        await this.service.update(id, validatedData);
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
}

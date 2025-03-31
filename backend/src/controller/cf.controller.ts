import { Request, Response, NextFunction } from "express";
import { CfService } from "../service/cf.service";
import { BaseController } from "./base.controller";
import {
  CfResponseDto,
  UpdateCfDto,
  CreateCfDto,
} from "../dtos/cf.dto";
import { createCfSchema } from "../validator/create/create-cf.validator";
import { updateCfSchema } from "../validator/update/update-cf.validator";

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
      const items: CfResponseDto[] = await this.service.getAll();
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
      const item: CfResponseDto | null = await this.service.getOne(id);
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
      const validatedData: CreateCfDto = createCfSchema.parse(req.body);
      const item: CfResponseDto = await this.service.create(validatedData);
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
      const validatedData: UpdateCfDto = updateCfSchema.parse(req.body);
      const updateditem: Partial<CfResponseDto> | null =
        await this.service.update(id, validatedData);
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
}

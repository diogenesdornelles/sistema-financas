import { Request, Response, NextFunction } from "express";
import { TxService } from "../service/tx.service";
import { BaseController } from "./base.controller";
import {
  TxResponseDto,
  UpdateTxDto,
  CreateTxDto,
} from "../dtos/tx.dto";
import { createTxSchema } from "../validator/create/create-tx.validator";
import { updateTxSchema } from "../validator/update/update-tx.validator";

export default class TxController extends BaseController<TxService> {
  constructor() {
    super(new TxService());
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: TxResponseDto[] = await this.service.getAll();
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
      const item: TxResponseDto | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: "Transação não encontrada" });
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
      const validatedData: CreateTxDto = createTxSchema.parse(req.body);
      const item: TxResponseDto = await this.service.create(validatedData);
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
      const validatedData: UpdateTxDto = updateTxSchema.parse(req.body);
      const updatedItem: Partial<TxResponseDto> | null =
        await this.service.update(id, validatedData);
      if (!updatedItem) {
        res.status(404).json({ message: "Transação não encontrada" });
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
        res.status(404).json({ message: "Transação não encontrada" });
        return;
      }
      res.status(200).json({ message: "Transação deletada!" });
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

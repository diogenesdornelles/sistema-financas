import { Request, Response, NextFunction } from "express";
import { TxService } from "../service/tx.service";
import { BaseController } from "./base.controller";
import {
  TxProps,
  UpdateTx,
  CreateTx,
} from "../../../packages/dtos/tx.dto"
import {createTxSchema} from '../../../packages/validators/zod-schemas/create/create-tx.validator'
import {updateTxSchema} from '../../../packages/validators/zod-schemas/update/update-tx.validator'

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
      const items: TxProps[] = await this.service.getAll();
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
      const item: TxProps | null = await this.service.getOne(id);
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
      const validatedData: CreateTx = createTxSchema.parse(req.body);
      const item: TxProps = await this.service.create(validatedData);
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
      const validatedData: UpdateTx = updateTxSchema.parse(req.body);
      const updatedItem: Partial<TxProps> | null =
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

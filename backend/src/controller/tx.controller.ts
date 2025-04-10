import { Request, Response, NextFunction } from "express";
import { TxService } from "../service/tx.service";
import { BaseController } from "./base.controller";
import { UpdateTx, CreateTx, QueryTx } from "../../../packages/dtos/tx.dto";
import { createTxSchema } from "../../../packages/validators/zod-schemas/create/create-tx.validator";
import { updateTxSchema } from "../../../packages/validators/zod-schemas/update/update-tx.validator";
import { queryTxSchema } from "../../../packages/validators/zod-schemas/query/query-tx.validator";
import { Tx } from "../entity/entities";

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
      const items: Tx[] = await this.service.getAll();
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
        const items: Tx[] | null = await this.service.getMany(skipInt);
        if (!items) {
          res.status(404).json({ message: "transações não encontradas" });
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
      const item: Tx | null = await this.service.getOne(id);
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
      const item: Tx = await this.service.create(validatedData);
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
      const updatedItem: Partial<Tx> | null = await this.service.update(
        id,
        validatedData,
      );
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
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: QueryTx = queryTxSchema.parse(req.body);
      const item: Tx[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

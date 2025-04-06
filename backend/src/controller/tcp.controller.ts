import { Request, Response, NextFunction } from "express";
import { TcpService } from "../service/tcp.service";
import { BaseController } from "./base.controller";
import { TcpProps, UpdateTcp, CreateTcp, QueryTcp } from "../../../packages/dtos/tcp.dto";
import { createTcpSchema } from "../../../packages/validators/zod-schemas/create/create-tcp.validator";
import { updateTcpSchema } from "../../../packages/validators/zod-schemas/update/update-tcp.validator";
import { queryTcpSchema } from "../../../packages/validators/zod-schemas/query/query-tcp.validator";

export default class TcpController extends BaseController<TcpService> {
  constructor() {
    super(new TcpService());
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: TcpProps[] = await this.service.getAll();
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
      const item: TcpProps | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: "Tipo conta não encontrada" });
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
      const validatedData: CreateTcp = createTcpSchema.parse(req.body);
      const item: TcpProps = await this.service.create(validatedData);
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
      const validatedData: UpdateTcp = updateTcpSchema.parse(req.body);
      const updatedItem: Partial<TcpProps> | null = await this.service.update(
        id,
        validatedData,
      );
      if (!updatedItem) {
        res.status(404).json({ message: "Tipo conta não encontrada" });
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
        res.status(404).json({ message: "Tipo conta não encontrada" });
        return;
      }
      res.status(200).json({ message: "Tipo conta deletado!" });
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
          const validatedData: QueryTcp = queryTcpSchema.parse(req.body);
          const item: TcpProps[] = await this.service.query(validatedData);
          res.status(201).json(item);
          return;
        } catch (error) {
          next(error);
          return;
        }
      };
}

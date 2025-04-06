import { Request, Response, NextFunction } from "express";
import { PartnerService } from "../service/partner.service";
import { BaseController } from "./base.controller";
import {
  PartnerProps,
  UpdatePartner,
  CreatePartner,
  QueryPartner,
} from "../../../packages/dtos/partner.dto";
import { createPartnerSchema } from "../../../packages/validators/zod-schemas/create/create-partner.validator";
import { updatePartnerSchema } from "../../../packages/validators/zod-schemas/update/update-partner.validator";
import { queryPartnerSchema } from "../../../packages/validators/zod-schemas/query/query-partner.validator";

export default class PartnerController extends BaseController<PartnerService> {
  constructor() {
    super(new PartnerService());
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: PartnerProps[] = await this.service.getAll();
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
      const item: PartnerProps | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: "Parceiro não encontrado" });
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
      const validatedData: CreatePartner = createPartnerSchema.parse(req.body);
      const item: PartnerProps = await this.service.create(validatedData);
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
      const validatedData: UpdatePartner = updatePartnerSchema.parse(req.body);
      const updatedItem: Partial<PartnerProps> | null =
        await this.service.update(id, validatedData);
      if (!updatedItem) {
        res.status(404).json({ message: "Parceiro não encontrado" });
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
        res.status(404).json({ message: "Parceiro não encontrado" });
        return;
      }
      res.status(200).json({ message: "Parceiro deletado!" });
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
      const validatedData: QueryPartner = queryPartnerSchema.parse(req.body);
      const item: PartnerProps[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

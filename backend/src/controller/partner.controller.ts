import { Request, Response, NextFunction } from "express";
import { PartnerService } from "../service/partner.service";
import { BaseController } from "./base.controller";
import {
  CreatePartnerDto,
  PartnerResponseDto,
  UpdatePartnerDto,

} from "../dtos/partner.dto";
import { createPartnerSchema } from "../validator/create/create-partner.validator";
import { updatePartnerSchema } from "../validator/update/update-partner.validator";

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
      const items: PartnerResponseDto[] = await this.service.getAll();
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
      const item: PartnerResponseDto | null = await this.service.getOne(id);
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
      const validatedData: CreatePartnerDto = createPartnerSchema.parse(req.body);
      const item: PartnerResponseDto = await this.service.create(validatedData);
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
      const validatedData: UpdatePartnerDto = updatePartnerSchema.parse(req.body);
      const updatedItem: Partial<PartnerResponseDto> | null =
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
}

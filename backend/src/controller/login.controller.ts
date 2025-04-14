import { Request, Response, NextFunction } from "express";

import { BaseController } from "./base.controller";

import { TokenProps, CreateToken } from "../../../packages/dtos/token.dto";
import LoginService from "../service/login.service";
import { createTokenSchema } from "../../../packages/validators/zod-schemas/create/create-token.validator";

export default class LoginController extends BaseController<LoginService> {
  constructor() {
    super(new LoginService());
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: CreateToken = createTokenSchema.parse(req.body);
      const result: TokenProps = await this.service.create(validatedData);
      res.status(201).json(result);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  public getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public getMany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public getOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public query(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

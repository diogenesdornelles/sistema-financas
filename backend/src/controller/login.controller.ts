import { NextFunction, Request, Response } from "express";

import { BaseController } from "./base.controller.js";

import { CreateToken, createTokenSchema, TokenProps } from "@monorepo/packages";
import LoginService from "../service/login.service.js";

/**
 * Controla o fluxo de requisições e respostas de Login
 *
 * @export
 * @class LoginController
 * @extends {BaseController<LoginService>}
 */
export default class LoginController extends BaseController<LoginService> {
  constructor() {
    super(new LoginService());
  }
  /**
   * Gerencia a criação de um token
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof LoginController
   */
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
  /**
   * Gerencia a devolução de todos os tokens
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {*}  {Promise<void>}
   * @memberof LoginController
   */
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

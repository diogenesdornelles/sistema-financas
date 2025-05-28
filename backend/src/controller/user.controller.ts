import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service";
import { BaseController } from "./base.controller";
import {
  queryUserSchema,
  updateUserSchema,
  createUserSchema,
  UpdateUser,
  CreateUser,
  QueryUser,
} from "@monorepo/packages";
import { User } from "../entity/entities";

/**
 * Controla o fluxo de requisições e respostas de Usuários
 *
 * @export
 * @class UserController
 * @extends {BaseController<UserService>}
 */
export default class UserController extends BaseController<UserService> {
  constructor() {
    super(new UserService());
  }
  /**
   * Gerencia a devolução de todos os usuários
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: User[] = await this.service.getAll();
      res.status(200).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de todos os usuários
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public getMany = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { skip } = req.params;
      const skipInt = parseInt(skip);
      if (skipInt >= 0) {
        const items: User[] | null = await this.service.getMany(skipInt);
        if (!items) {
          res.status(404).json({ message: "Usuários não encontrados" });
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
  /**
   * Gerencia a devolução de todos os usuários
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: User | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }
      res.status(200).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a criação de um usuário
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: CreateUser = createUserSchema.parse(req.body);
      const user: Omit<User, "pwd"> = await this.service.create(validatedData);
      res.status(201).json(user);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a criação de um usuário
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData: UpdateUser = updateUserSchema.parse(req.body);
      const updatedUser: Partial<User> | null = await this.service.update(
        id,
        validatedData,
      );
      if (!updatedUser) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }
      res.status(200).json(updatedUser);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a criação de um usuário
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const success: boolean = await this.service.delete(id);
      if (!success) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }
      res.status(200).json({ message: "Usuário deletado!" });
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  /**
   * Gerencia a requição de uma busca profunda
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: QueryUser = queryUserSchema.parse(req.body);
      const items: User[] = await this.service.query(validatedData);
      res.status(201).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

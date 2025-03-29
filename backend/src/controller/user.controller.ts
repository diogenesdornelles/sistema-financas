import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service";
import { BaseController } from "./base.controller";
import { CreateUserDTO } from "../dtos/create/create-user.dto";
import { UpdateUserDTO } from "../dtos/update/update-user.dto";
import { ResponseUserDTO } from "../dtos/response/response-user.dto";
import { createUserSchema } from "../validator/create/create-user.validator";
import { updateUserSchema } from "../validator/update/update-user.validator";

export default class UserController extends BaseController<UserService> {
  constructor() {
    super(new UserService());
  }

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users: ResponseUserDTO[] = await this.service.getAll();
      res.status(200).json(users);
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
      const user: ResponseUserDTO | null = await this.service.getOne(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
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
      const validatedData: CreateUserDTO = createUserSchema.parse(req.body);
      const user: ResponseUserDTO = await this.service.create(validatedData);
      res.status(201).json(user);
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
      const validatedData: UpdateUserDTO = updateUserSchema.parse(req.body);
      const updatedUser: Partial<ResponseUserDTO> | null = await this.service.update(id, validatedData);
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(updatedUser);
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
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ message: "User deleted!" });
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

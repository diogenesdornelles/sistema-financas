import { NextFunction, Request, Response } from "express";
import { Base } from "../entity/entities.js";
import { BaseService } from "../service/base.service.js";

/**
 * Classe abstrata BaseController.
 *
 * Fornece a estrutura básica para controladores, exigindo uma instância de serviço
 * para lidar com a lógica de negócios. Subclasses devem implementar os métodos abstratos
 * para operações CRUD e consultas.
 *
 * @template T - Tipo do serviço, que deve estender BaseService.
 */
export abstract class BaseController<
  T extends BaseService<
    Base,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >,
> {
  public service: T;

  constructor(service: T) {
    this.service = service;
  }

  public abstract getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  public abstract getMany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  public abstract getOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  public abstract create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  public abstract update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  public abstract delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  public abstract query(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

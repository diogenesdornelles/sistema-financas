import {
  CreateCat,
  createCatSchema,
  QueryCat,
  queryCatSchema,
  UpdateCat,
  updateCatSchema,
} from '@monorepo/packages';
import { NextFunction, Request, Response } from 'express';
import { Cat } from '../entity/entities.js';
import { CatService } from '../service/cat.service.js';
import { BaseController } from './base.controller.js';

/**
 * Controla o fluxo de requisições e respostas de Categorias
 *
 * @export
 * @class CatController
 * @extends {BaseController<CatService>}
 */
export default class CatController extends BaseController<CatService> {
  /**
   * Creates an instance of CatController.
   * @memberof CatController
   */
  constructor() {
    super(new CatService());
  }
  /**
   * Gerencia a devolução de todas as categorias
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CatController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Cat[] = await this.service.getAll();
      res.status(200).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução algumas categorias, de acordo com um skip
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CatController
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
        const items: Cat[] | null = await this.service.getMany(skipInt);
        if (!items) {
          res.status(404).json({ message: 'Categorias não encontradas' });
          return;
        }
        res.status(200).json(items);
      } else {
        res
          .status(404)
          .json({ message: 'Skip deve ser um número inteiro positivo' });
        return;
      }
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a obtenção de uma categoria pelo ID
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CatController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: Cat | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: 'Categoria não encontrada' });
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
   * Gerencia a criação de uma categoria, de acordo com o body
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CatController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // validação
      const validatedData: CreateCat = createCatSchema.parse(req.body);
      const item: Cat = await this.service.create(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a atualização de uma categoria, de acordo com o id e o body
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CatController
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      // validação
      const validatedData: UpdateCat = updateCatSchema.parse(req.body);
      const updatedItem: Partial<Cat> | null = await this.service.update(
        id,
        validatedData,
      );
      if (!updatedItem) {
        res.status(404).json({ message: 'Categoria não encontrada' });
        return;
      }
      res.status(200).json(updatedItem);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a deleção de uma categoria pelo ID
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof CatController
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
        res.status(404).json({ message: 'Categoria não encontrada' });
        return;
      }
      res.status(200).json({ message: 'Categoria deletada!' });
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
   * @memberof CatController
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // validação
      const validatedData: QueryCat = queryCatSchema.parse(req.body);
      const item: Cat[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

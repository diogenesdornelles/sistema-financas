import {
  CreatePartner,
  createPartnerSchema,
  QueryPartner,
  queryPartnerSchema,
  UpdatePartner,
  updatePartnerSchema,
} from '@monorepo/packages';
import { NextFunction, Request, Response } from 'express';
import { Partner } from '../entity/entities.js';
import { PartnerService } from '../service/partner.service.js';
import { BaseController } from './base.controller.js';

/**
 * Controla o fluxo de requisições e respostas de Parceiros
 *
 * @export
 * @class PartnerController
 * @extends {BaseController<PartnerService>}
 */
export default class PartnerController extends BaseController<PartnerService> {
  /**
   * Creates an instance of PartnerController.
   * @memberof PartnerController
   */
  constructor() {
    super(new PartnerService());
  }
  /**
   * Gerencia a devolução de todos os parceiros
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof PartnerController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Partner[] = await this.service.getAll();
      res.status(200).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução alguns parceiros, de acordo com um skip
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {*}  {Promise<void>}
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
        const items: Partner[] | null = await this.service.getMany(skipInt);
        if (!items) {
          res.status(404).json({ message: 'Parceiros não encontrados' });
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
   * Gerencia a devolução de um parceiro
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof PartnerController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: Partner | null = await this.service.getOne(id);
      if (!item) {
        res.status(404).json({ message: 'Parceiro não encontrado' });
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
   * Gerencia a criação de um parceiro
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof PartnerController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: CreatePartner = createPartnerSchema.parse(req.body);
      const item: Partner = await this.service.create(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a criação de um parceiro
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof PartnerController
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData: UpdatePartner = updatePartnerSchema.parse(req.body);
      const updatedItem: Partial<Partner> | null = await this.service.update(
        id,
        validatedData,
      );
      if (!updatedItem) {
        res.status(404).json({ message: 'Parceiro não encontrado' });
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
   * Gerencia a deleção de um parceiro
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof PartnerController
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
        res.status(404).json({ message: 'Parceiro não encontrado' });
        return;
      }
      res.status(200).json({ message: 'Parceiro deletado!' });
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
   * @memberof PartnerController
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: QueryPartner = queryPartnerSchema.parse(req.body);
      const item: Partner[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

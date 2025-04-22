import { Request, Response, NextFunction } from "express";
import { TcpService } from "../service/tcp.service";
import { BaseController } from "./base.controller";
import { UpdateTcp, CreateTcp, QueryTcp } from "../../../packages/dtos/tcp.dto";
import { createTcpSchema } from "../../../packages/validators/zod-schemas/create/create-tcp.validator";
import { updateTcpSchema } from "../../../packages/validators/zod-schemas/update/update-tcp.validator";
import { queryTcpSchema } from "../../../packages/validators/zod-schemas/query/query-tcp.validator";
import { Tcp } from "../entity/entities";

/**
 * Controla o fluxo de requisições e respostas de Tipo de contas
 *
 * @export
 * @class TcpController
 * @extends {BaseController<TcpService>}
 */
export default class TcpController extends BaseController<TcpService> {
  /**
   * Creates an instance of TcpController.
   * @memberof TcpController
   */
  constructor() {
    super(new TcpService());
  }

  /**
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcpController
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const items: Tcp[] = await this.service.getAll();
      res.status(200).json(items);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de todos os tipos de contas
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcpController
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
        const items: Tcp[] | null = await this.service.getMany(skipInt);
        if (!items) {
          res.status(404).json({ message: "Tipo de contas não encontradas" });
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
   * Gerencia a devolução de um tipo de conta
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcpController
   */
  public getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const item: Tcp | null = await this.service.getOne(id);
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
  /**
   * Gerencia a devolução de um tipo de conta
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcpController
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: CreateTcp = createTcpSchema.parse(req.body);
      const item: Tcp = await this.service.create(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
  /**
   * Gerencia a criação de um tipo de conta
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcpController
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData: UpdateTcp = updateTcpSchema.parse(req.body);
      const updatedItem: Partial<Tcp> | null = await this.service.update(
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
  /**
   * Gerencia a criação de um tipo de conta
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcpController
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

  /**
   * Gerencia a requição de uma busca profunda
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TcpController
   */
  public query = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData: QueryTcp = queryTcpSchema.parse(req.body);
      const item: Tcp[] = await this.service.query(validatedData);
      res.status(201).json(item);
      return;
    } catch (error) {
      next(error);
      return;
    }
  };
}

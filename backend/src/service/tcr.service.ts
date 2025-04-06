import { BaseService } from "./base.service";
import { Tcr } from "../entity/entities";
import {
  CreateTcr,
  UpdateTcr,
  TcrProps,
  QueryTcr,
} from "../../../packages/dtos/tcr.dto";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { FindOptionsWhere, Like } from "typeorm";

export class TcrService extends BaseService<
  Tcr,
  TcrProps,
  CreateTcr,
  UpdateTcr,
  QueryTcr
> {
  constructor() {
    super(Tcr);
  }

  /**
   * Recupera todos os tipos de contas.
   */
  public getAll = async (): Promise<TcrProps[]> => {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new Error(`Erro ao recuperar tipos de conta: ${error}`);
    }
  };

  /**
   * Recupera um tipo de conta pelo identificador.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<TcrProps | null> => {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Erro ao recuperar tipo de conta com ID ${id}: ${error}`);
    }
  };

  /**
   * Cria um novo tipo de conta.
   *
   * @param data - Dados para criação.
   */
  public create = async (data: CreateTcr): Promise<TcrProps> => {
    try {
      const createdTcf = await this.repository.save(
        this.repository.create(data),
      );
      return createdTcf;
    } catch (error) {
      throw new Error(`Erro ao criar tipo de conta: ${error}`);
    }
  };

  /**
   * Atualiza um tipo de conta existente.
   *
   * @param id - Identificador.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdateTcr,
  ): Promise<Partial<TcrProps> | null> => {
    try {
      await this.repository.update({ id }, data);
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Erro ao atualizar tipo de conta com ID ${id}: ${error}`);
    }
  };

  /**
   * Remove logicamente um tipo de conta.
   *
   * @param id - Identificador.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: false });
      const updated = await this.repository.findOne({ where: { id } });
      return !!updated && updated.status === false;
    } catch (error) {
      throw new Error(`Erro ao remover tipo de conta com ID ${id}: ${error}`);
    }
  };

  /**
   * Realiza um filtro.
   *
   * @param data - Dados para busca.
   */
  public query = async (data: QueryTcr): Promise<TcrProps[]> => {
    try {
      const where: FindOptionsWhere<Tcr> = {};

      if (data.name) {
        where.name = Like(`%${data.name}%`);
      }

      if (data.status !== undefined) {
        where.status = data.status;
      }

      if (data.createdAt) {
        const updatedDate = new Date(data.createdAt);
        where.updatedAt = updatedDate;
      }

      if (data.updatedAt) {
        const updatedDate = new Date(data.updatedAt);
        where.updatedAt = updatedDate;
      }

      return await this.repository.find({
        where,
        relations: [],
      });
    } catch (error) {
      throw new Error(`Erro ao filtrar tipos: ${error}`);
    }
  };
}

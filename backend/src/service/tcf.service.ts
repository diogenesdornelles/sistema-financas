import { BaseService } from "./base.service";
import { Tcf } from "../entity/entities";
import { CreateTcf, UpdateTcf, QueryTcf } from "../../../packages/dtos/tcf.dto";
import { FindOptionsWhere, Like, MoreThanOrEqual, Raw } from "typeorm";

export class TcfService extends BaseService<
  Tcf,
  Tcf,
  CreateTcf,
  UpdateTcf,
  QueryTcf
> {
  constructor() {
    super(Tcf);
  }

  /**
   * Recupera todos os tipos de contas.
   */
  public getAll = async (): Promise<Tcf[]> => {
    try {
      return await this.repository.find({ where: { status: true } });
    } catch (error) {
      throw new Error(`Erro ao recuperar tipos de conta financeira: ${error}`);
    }
  };

  /**
   * Recupera todos os tipos de contas.
   */
  public getMany = async (skip: number): Promise<Tcf[]> => {
    try {
      return await this.repository.find({
        skip,
        take: 10,
        where: { status: true },
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar tipos de conta financeira: ${error}`);
    }
  };

  /**
   * Recupera um tipo de conta pelo identificador.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<Tcf | null> => {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(
        `Erro ao recuperar tipo de conta financeira com ID ${id}: ${error}`,
      );
    }
  };

  /**
   * Cria um novo tipo de conta financeira.
   *
   * @param data - Dados para criação.
   */
  public create = async (data: CreateTcf): Promise<Tcf> => {
    try {
      console.log(data)
      const createdTcf = await this.repository.save(
        this.repository.create(data),
      );
      return createdTcf;
    } catch (error) {
      throw new Error(`Erro ao criar tipo de conta financeira: ${error}`);
    }
  };

  /**
   * Atualiza um tipo de conta financeira existente.
   *
   * @param id - Identificador.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdateTcf,
  ): Promise<Partial<Tcf> | null> => {
    try {
      await this.repository.update({ id }, data);
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(
        `Erro ao atualizar tipo de conta financeira com ID ${id}: ${error}`,
      );
    }
  };

  /**
   * Remove logicamente um tipo de conta financeira.
   *
   * @param id - Identificador.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: false });
      const updated = await this.repository.findOne({ where: { id } });
      return !!updated && updated.status === false;
    } catch (error) {
      throw new Error(
        `Erro ao remover tipo de conta financeira com ID ${id}: ${error}`,
      );
    }
  };

  /**
   * Realiza um filtro.
   *
   * @param data - Dados para busca.
   */
  public query = async (data: QueryTcf): Promise<Tcf[]> => {
    try {
      const where: FindOptionsWhere<Tcf> = {};

      if (data.id) {
        where.id = Raw((alias) => `${alias}::text ILIKE :id`, { id: `%${data.id}%` });
      }

      if (data.name) {
        where.name = Like(`%${data.name}%`);
      }

      if (data.status) {
        where.status = data.status;
      }

      if (data.updatedAt) {
        const updatedDate = new Date(data.updatedAt);
        where.updatedAt = MoreThanOrEqual(updatedDate);
      }

      if (data.createdAt) {
        const updatedDate = new Date(data.createdAt);
        where.createdAt = MoreThanOrEqual(updatedDate);
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

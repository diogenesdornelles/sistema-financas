import { BaseService } from "./base.service";
import { Tcp } from "../entity/entities";
import { CreateTcp, UpdateTcp, QueryTcp } from "../../../packages/dtos/tcp.dto";
import { FindOptionsWhere, ILike, MoreThanOrEqual, Raw } from "typeorm";

export class TcpService extends BaseService<
  Tcp,
  Tcp,
  CreateTcp,
  UpdateTcp,
  QueryTcp
> {
  constructor() {
    super(Tcp);
  }

  /**
   * Recupera todos os tipos de contas.
   */
  public getAll = async (): Promise<Tcp[]> => {
    try {
      return await this.repository.find({ where: { status: true } });
    } catch (error) {
      throw new Error(`Erro ao recuperar tipos de conta: ${error}`);
    }
  };

  /**
   * Recupera 10 tipos de contas, com skip.
   */
  public getMany = async (skip: number): Promise<Tcp[]> => {
    try {
      return await this.repository.find({
        skip,
        take: 10,
        where: { status: true },
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar tipos de conta: ${error}`);
    }
  };

  /**
   * Recupera um tipo de conta pelo identificador.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<Tcp | null> => {
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
  public create = async (data: CreateTcp): Promise<Tcp> => {
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
    data: UpdateTcp,
  ): Promise<Partial<Tcp> | null> => {
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
  public query = async (data: QueryTcp): Promise<Tcp[]> => {
    try {
      const where: FindOptionsWhere<Tcp> = {};

      if (data.id) {
        where.id = Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :id`, {
          id: `%${data.id}%`,
        });
      }

      if (data.name) {
        where.name = ILike(`%${data.name}%`);
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

import { BaseService } from "./base.service";
import { Cat, Cf, Cp, Cr, Tx, User } from "../entity/entities";
import { CreateTx, QueryTx, UpdateTx } from "../../../packages/dtos/tx.dto";
import { FindOptionsWhere, Like, MoreThanOrEqual, Raw } from "typeorm";

export class TxService extends BaseService<
  Tx,
  Tx,
  CreateTx,
  UpdateTx,
  QueryTx
> {
  private readonly relations: string[];
  constructor() {
    super(Tx);
    this.relations = ["category", "cf", "cr", "cp"];
  }

  /**
   * Recupera todas as transações.
   */
  public getAll = async (): Promise<Tx[]> => {
    try {
      return await this.repository.find({
        relations: this.relations,
        where: { status: true },
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar transações: ${error}`);
    }
  };

  /**
   * Recupera 10 transações, com skip.
   */
  public getMany = async (skip: number): Promise<Tx[]> => {
    try {
      return await this.repository.find({
        skip,
        take: 10,
        where: { status: true },
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar transações: ${error}`);
    }
  };

  /**
   * Recupera uma transação pelo identificador.
   *
   * @param id - Identificador da transação.
   */
  public getOne = async (id: string): Promise<Tx | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar transação com ID ${id}: ${error}`);
    }
  };

  /**
   * Cria uma nova transação.
   *
   * @param data - Dados para criação.
   */
  public create = async (data: CreateTx): Promise<Tx> => {
    try {
      const newTx = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        category: { id: data.category } as Cat,
        cf: { id: data.cf } as Cf,
        cp: { id: data.cp } as Cp,
        cr: { id: data.cr } as Cr,
        value: data.value
          ? parseFloat(data.value.replace(/\./g, "").replace(",", "."))
          : undefined,
      });

      const createdTx = await this.repository.save(newTx);

      return await this.repository.findOneOrFail({
        where: { id: createdTx.id },
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao criar transação: ${error}`);
    }
  };

  /**
   * Atualiza uma transação existente.
   *
   * @param id - Identificador da transação.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdateTx,
  ): Promise<Partial<Tx> | null> => {
    try {
      const updateData: Partial<Tx> = {
        ...data,
        category: data.category ? ({ id: data.category } as Cat) : undefined,
        cf: data.cf ? ({ id: data.cf } as Cf) : undefined,
        cp: data.cp ? ({ id: data.cp } as Cp) : undefined,
        cr: data.cr ? ({ id: data.cr } as Cr) : undefined,
        value: data.value
          ? parseFloat(data.value.replace(/\./g, "").replace(",", "."))
          : undefined,
        tdate: data.tdate ? new Date(data.tdate) : undefined,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar transação com ID ${id}: ${error}`);
    }
  };

  /**
   * Remove logicamente uma transação.
   *
   * @param id - Identificador da transação.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: false });
      const updatedTx = await this.repository.findOne({ where: { id } });
      return updatedTx?.status === false;
    } catch (error) {
      throw new Error(`Erro ao remover transação com ID ${id}: ${error}`);
    }
  };
  /**
   * Realiza um filtro.
   *
   * @param data - Dados para busca.
   */
  public query = async (data: QueryTx): Promise<Tx[]> => {
    try {
      const where: FindOptionsWhere<Tx> = {};

      if (data.id) {
        where.id = Raw((alias) => `${alias}::text ILIKE :id`, { id: `%${data.id}%` });
      }

      if (data.value) {
        const value = parseFloat(
          data.value.replace(/\./g, "").replace(",", "."),
        );
        if (!isNaN(value)) {
          where.value = MoreThanOrEqual(value);
        }
      }

      if (data.cf) {
        where.cf = { id: Like(`%${data.cf}%`) };
      }

      if (data.cp) {
        where.cp = { id: Like(`%${data.cp}%`) };
      }

      if (data.cr) {
        where.cr = { id: Like(`%${data.cr}%`) };
      }

      if (data.description) {
        where.description = Like(`%${data.description}%`);
      }

      if (data.category) {
        where.category = { name: Like(`%${data.category}%`) };
      }

      if (data.obs) {
        where.obs = Like(`%${data.obs}%`);
      }

      if (data.status) {
        where.status = data.status;
      }

      if (data.tdate) {
        const updatedDate = new Date(data.tdate);
        where.updatedAt = MoreThanOrEqual(updatedDate);
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
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao filtrar transações: ${error}`);
    }
  };
}

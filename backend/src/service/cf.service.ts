import { BaseService } from "./base.service";
import { Cf, Tcf, User } from "../entity/entities";
import {
  CreateCf,
  UpdateCf,
  CfProps,
  QueryCf,
} from "../../../packages/dtos/cf.dto";
import { FindOptionsWhere, Like, MoreThanOrEqual } from "typeorm";

export class CfService extends BaseService<
  Cf,
  CfProps,
  CreateCf,
  UpdateCf,
  QueryCf
> {
  constructor() {
    super(Cf);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<CfProps[]> => {
    try {
      const cfs = await this.repository.find({ relations: ["type"] });
      return cfs;
    } catch (error) {
      throw new Error(`Erro ao recuperar contas: ${error}`);
    }
  };

  /**
   * Recupera 10 com skip.
   */
  public getMany = async (skip: number): Promise<CfProps[]> => {
    try {
      const cfs = await this.repository.find({
        skip,
        take: 10,
        relations: ["type"],
      });
      return cfs;
    } catch (error) {
      throw new Error(`Erro ao recuperar contas: ${error}`);
    }
  };

  /**
   * Recupera uma conta  pelo identificador.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<CfProps | null> => {
    try {
      const cf = await this.repository.findOne({
        where: { id },
        relations: ["type"],
      });
      return cf;
    } catch (error) {
      throw new Error(`Erro ao recuperar conta com ID ${id}: ${error}`);
    }
  };

  /**
   * Cria uma nova conta.
   *
   * @param data - Dados para criação.
   */
  public create = async (data: CreateCf): Promise<CfProps> => {
    try {
      const cf = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcf,
        balance: data.balance
          ? parseFloat(data.balance.replace(/\./g, "").replace(",", "."))
          : 0.0,
      });
      const createdCf = await this.repository.save(cf);

      return await this.repository.findOneOrFail({
        where: { id: createdCf.id },
        relations: ["type"],
      });
    } catch (error) {
      throw new Error(`Erro ao criar conta : ${error}`);
    }
  };

  /**
   * Atualiza uma conta  existente.
   *
   * @param id - Identificador.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdateCf,
  ): Promise<Partial<CfProps> | null> => {
    try {
      const updateData: Partial<Cf> = {
        ...data,
        type: data.type ? ({ id: data.type } as Tcf) : undefined,
        balance: data.balance
          ? parseFloat(data.balance.replace(/\./g, "").replace(",", "."))
          : undefined,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: ["type"],
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar conta  com ID ${id}: ${error}`);
    }
  };

  /**
   * Remove logicamente uma conta  (status = false).
   *
   * @param id - Identificador.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: false });
      const updatedCf = await this.repository.findOne({ where: { id } });
      return !!updatedCf && !updatedCf.status;
    } catch (error) {
      throw new Error(`Erro ao remover conta  com ID ${id}: ${error}`);
    }
  };

  /**
   * Realiza um filtro.
   *
   * @param data - Dados para busca.
   */
  public query = async (data: QueryCf): Promise<CfProps[]> => {
    try {
      const where: FindOptionsWhere<Cf> = {};

      if (data.number) {
        where.number = Like(`%${data.number}%`);
      }

      if (data.balance) {
        const balanceValue = parseFloat(
          data.balance.replace(/\./g, "").replace(",", "."),
        );
        if (!isNaN(balanceValue)) {
          where.balance = MoreThanOrEqual(balanceValue);
        }
      }

      if (data.type) {
        where.type = { name: Like(`%${data.type}%`) };
      }

      if (data.ag) {
        where.ag = Like(`%${data.ag}%`);
      }

      if (data.bank) {
        where.bank = Like(`%${data.bank}%`);
      }

      if (data.obs) {
        where.obs = Like(`%${data.obs}%`);
      }

      if (data.status !== undefined) {
        where.status = data.status;
      }

      if (data.createdAt) {
        const createdDate = new Date(data.createdAt);
        where.createdAt = createdDate;
      }

      if (data.updatedAt) {
        const updatedDate = new Date(data.updatedAt);
        where.updatedAt = updatedDate;
      }

      return await this.repository.find({
        where,
        relations: ["type"],
      });
    } catch (error) {
      throw new Error(`Erro ao filtrar contas financeiras: ${error}`);
    }
  };
}

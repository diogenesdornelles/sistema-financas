import { BaseService } from "./base.service";
import { Cf, Tcf, User } from "../entity/entities";
import { CreateCf, UpdateCf, QueryCf } from "../../../packages/dtos/cf.dto";
import { FindOptionsWhere, ILike, Like, MoreThanOrEqual, Raw } from "typeorm";


export class CfService extends BaseService<
  Cf,
  Cf,
  CreateCf,
  UpdateCf,
  QueryCf
> {
  constructor() {
    super(Cf);
    this.relations = ["type"]
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<Cf[]> => {
    try {
      const cfs = await this.repository.find({
        relations: this.relations,
        where: { status: true },
      });
      return cfs;
    } catch (error) {
      throw new Error(`Erro ao recuperar contas: ${error}`);
    }
  };

  /**
   * Recupera 10 com skip.
   */
  public getMany = async (skip: number): Promise<Cf[]> => {
    try {
      const cfs = await this.repository.find({
        where: { status: true },
        skip,
        take: 10,
        relations: this.relations,
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
  public getOne = async (id: string): Promise<Cf | null> => {
    try {
      const cf = await this.repository.findOne({
        where: { id },
        relations: this.relations,
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
  public create = async (data: CreateCf): Promise<Cf> => {
    try {

      const cf = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcf,
        firstBalance: data.balance ? parseFloat(data.balance) : 0.0,
        currentBalance: data.balance ? parseFloat(data.balance) : 0.0
      });
      const createdCf = await this.repository.save(cf);

      return await this.repository.findOneOrFail({
        where: { id: createdCf.id },
        relations: this.relations,
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
  ): Promise<Partial<Cf> | null> => {
    try {

      const updateData: Partial<Cf> = {
        ...data,
        type: data.type ? ({ id: data.type } as Tcf) : undefined,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: this.relations,
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
  public query = async (data: QueryCf): Promise<Cf[]> => {
    try {
      const where: FindOptionsWhere<Cf> = {};

      if (data.id) {
        where.id = Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :id`, { id: `%${data.id}%` });
      }

      if (data.number) {
        where.number = Like(`%${data.number}%`);
      }

      if (data.firstBalance) {
        const balanceValue = parseFloat(
          data.firstBalance.replace(/\./g, "").replace(",", "."),
        );
        if (!isNaN(balanceValue)) {
          where.firstBalance = MoreThanOrEqual(balanceValue);
        }
      }

      if (data.currentBalance) {
        const balanceValue = parseFloat(
          data.currentBalance.replace(/\./g, "").replace(",", "."),
        );
        if (!isNaN(balanceValue)) {
          where.currentBalance = MoreThanOrEqual(balanceValue);
        }
      }

      if (data.type) {
        where.type = { name: ILike(`%${data.type}%`) };
      }

      if (data.ag) {
        where.ag = Like(`%${data.ag}%`);
      }

      if (data.bank) {
        where.bank = Like(`%${data.bank}%`);
      }

      if (data.obs) {
        where.obs = ILike(`%${data.obs}%`);
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
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao filtrar contas financeiras: ${error}`);
    }
  };
}

import { BaseService } from "./base.service";
import { Cr, Partner, Tcr, Tx, User } from "../entity/entities";
import {
  CreateCr,
  UpdateCr,
  QueryCr,
} from "../../../packages/dtos/cr.dto";
import { PaymentStatus } from "../../../packages/dtos/utils/enums";
import { FindOptionsWhere, Like, MoreThanOrEqual } from "typeorm";

export class CrService extends BaseService<
  Cr,
  Cr,
  CreateCr,
  UpdateCr,
  QueryCr
> {
  constructor() {
    super(Cr);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<Cr[]> => {
    try {
      return await this.repository.find({
        relations: ["type", "customer", "tx"],
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar contas: ${error}`);
    }
  };

  /**
   * Recupera todas as contas.
   */
  public getMany = async (skip: number): Promise<Cr[]> => {
    try {
      return await this.repository.find({
        skip,
        take: 10,
        relations: ["type", "customer", "tx"],
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar contas: ${error}`);
    }
  };

  /**
   * Recupera uma conta pelo identificador.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<Cr | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["type", "customer", "tx"],
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar conta com ID ${id}: ${error}`);
    }
  };

  /**
   * Cria uma nova conta.
   *
   * @param data - Dados para criação.
   */
  public create = async (data: CreateCr): Promise<Cr> => {
    try {
      const newCr = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcr,
        customer: { id: data.customer } as Partner,
        tx: { id: data.tx } as Tx,
        value: data.value
          ? parseFloat(data.value.replace(/\./g, "").replace(",", "."))
          : undefined,
      });

      const createdCr = await this.repository.save(newCr);

      return await this.repository.findOneOrFail({
        where: { id: createdCr.id },
        relations: ["type", "customer"],
      });
    } catch (error) {
      throw new Error(`Erro ao criar conta: ${error}`);
    }
  };

  /**
   * Atualiza uma conta existente.
   *
   * @param id - Identificador.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdateCr,
  ): Promise<Partial<Cr> | null> => {
    try {
      const updateData: Partial<Cr> = {
        ...data,
        type: data.type ? ({ id: data.type } as Tcr) : undefined,
        customer: data.customer
          ? ({ id: data.customer } as Partner)
          : undefined,
        tx: data.tx ? ({ id: data.tx } as Tx) : undefined,
        value: data.value
          ? parseFloat(data.value.replace(/\./g, "").replace(",", "."))
          : undefined,
        due: data.due ? new Date(data.due) : undefined,
        rdate: data.rdate ? new Date(data.rdate) : undefined,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: ["type", "customer", "tx"],
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar conta com ID ${id}: ${error}`);
    }
  };

  /**
   * Remove logicamente uma conta.
   *
   * @param id - Identificador.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: PaymentStatus.CANCELLED });
      const updatedCr = await this.repository.findOne({ where: { id } });
      return updatedCr?.status === PaymentStatus.CANCELLED;
    } catch (error) {
      throw new Error(`Erro ao remover conta com ID ${id}: ${error}`);
    }
  };

  /**
   * Realiza um filtro.
   *
   * @param data - Dados para busca.
   */
  public query = async (data: QueryCr): Promise<Cr[]> => {
    try {
      const where: FindOptionsWhere<Cr> = {};

      if (data.value) {
        const value = parseFloat(
          data.value.replace(/\./g, "").replace(",", "."),
        );
        if (!isNaN(value)) {
          where.value = MoreThanOrEqual(value);
        }
      }

      if (data.type) {
        where.type = { name: Like(`%${data.type}%`) };
      }

      if (data.customer) {
        where.customer = { name: Like(`%${data.customer}%`) };
      }

      if (data.due) {
        const updatedDate = new Date(data.due);
        where.updatedAt = updatedDate;
      }

      if (data.rdate) {
        const updatedDate = new Date(data.rdate);
        where.updatedAt = updatedDate;
      }

      if (data.obs) {
        where.obs = Like(`%${data.obs}%`);
      }

      if (data.status) {
        where.status = data.status;
      }

      if (data.tx) {
        where.tx = { id: Like(`%${data.tx}%`) };
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
        relations: ["type", "supplier", "tx"],
      });
    } catch (error) {
      throw new Error(`Erro ao filtrar contas a pagar: ${error}`);
    }
  };
}

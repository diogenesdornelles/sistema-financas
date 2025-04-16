import { BaseService } from "./base.service";
import { Cr, Partner, Tcr, Tx, User } from "../entity/entities";
import { CreateCr, UpdateCr, QueryCr } from "../../../packages/dtos/cr.dto";
import { PaymentStatus } from "../../../packages/dtos/utils/enums";
import { FindOptionsWhere, ILike, Like, MoreThanOrEqual, Not, Raw, Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import GeneralValidator from "../../../packages/validators/general.validator";
import { ApiError } from "../utils/api-error.util";

export class CrService extends BaseService<
  Cr,
  Cr,
  CreateCr,
  UpdateCr,
  QueryCr
> {
  public txRepo: Repository<Tx>
  constructor() {
    super(Cr);
    this.relations = ["type", "customer"];
    this.txRepo = AppDataSource.getRepository(Tx);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<Cr[]> => {
    try {
      return await this.repository.find({
        where: { status: Not(PaymentStatus.CANCELLED) },
        relations: this.relations,
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
        where: { status: Not(PaymentStatus.CANCELLED) },
        skip,
        take: 10,
        relations: this.relations,
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
        relations: this.relations,
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
        value: data.value ? parseFloat(data.value) : undefined,
      });

      const createdCr = await this.repository.save(newCr);

      return await this.repository.findOneOrFail({
        where: { id: createdCr.id },
        relations: this.relations,
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
        value: data.value ? parseFloat(data.value) : undefined,
        due: data.due ? new Date(data.due) : undefined,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: this.relations,
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
      // Verifica se a conta existe
      const cr = await this.repository.findOne({ where: { id } });
      if (!cr) {
        throw new Error(`Conta com ID ${id} não encontrada.`);
      }

      // Atualiza o status da conta para CANCELLED (deleção lógica)
      await this.repository.update({ id }, { status: PaymentStatus.CANCELLED });

      // Atualiza o status da transação associada, se existir
      const dbTx = await this.txRepo.findOne({ where: { cp: { id } } });
      if (dbTx) {
        await this.txRepo.update(dbTx.id, { status: false });
      }

      // Retorna true se a deleção lógica foi bem-sucedida
      return true;
    } catch (error) {
      throw new Error(`Erro ao remover conta com ID ${id}: ${String(error)}`);
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

      if (data.id) {
        where.id = Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :id`, { id: `%${data.id}%` });
      }

      if (data.value) {
        const value = parseFloat(
          data.value.replace(/\./g, "").replace(",", "."),
        );
        if (!isNaN(value)) {
          where.value = MoreThanOrEqual(value);
        }
      }

      if (data.type) {
        where.type = { name: ILike(`%${data.type}%`) };
      }

      if (data.customer) {
        where.customer = { name: ILike(`%${data.customer}%`) };
      }

      if (data.due) {
        const updatedDate = new Date(data.due);
        where.updatedAt = updatedDate;
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
      throw new Error(`Erro ao filtrar contas a pagar: ${error}`);
    }
  };
}

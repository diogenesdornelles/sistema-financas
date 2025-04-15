import { BaseService } from "./base.service";
import { Cp, Partner, Tcp, Tx, User } from "../entity/entities";
import { CreateCp, UpdateCp, QueryCp } from "../../../packages/dtos/cp.dto";
import { PaymentStatus } from "../../../packages/dtos/utils/enums";
import { FindOptionsWhere, Like, MoreThanOrEqual, Not, Raw, Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import GeneralValidator from "../../../packages/validators/general.validator";
import { ApiError } from "../utils/api-error.util";

export class CpService extends BaseService<
  Cp,
  Cp,
  CreateCp,
  UpdateCp,
  QueryCp
> {
  public txRepo: Repository<Tx>
  constructor() {
    super(Cp);
    this.relations = ["type", "supplier"];
    this.txRepo = AppDataSource.getRepository(Tx);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<Cp[]> => {
    try {
      return await this.repository.find({
        relations: this.relations,
        where: { status: Not(PaymentStatus.CANCELLED) },
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar contas: ${error}`);
    }
  };

  /**
   * Recupera 10 contas com skip.
   */
  public getMany = async (skip: number): Promise<Cp[]> => {
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
  public getOne = async (id: string): Promise<Cp | null> => {
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
  public create = async (data: CreateCp): Promise<Cp> => {
    try {

      const value = GeneralValidator.validateMoneyString(data.value)

      if (!value) {
        throw new ApiError(401, "Informar um valor Pt-Br válido")
      }
      const newCp = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcp,
        supplier: { id: data.supplier } as Partner,
        value: value
          ? parseFloat(value)
          : undefined,
      });

      const createdCp = await this.repository.save(newCp);

      return await this.repository.findOneOrFail({
        where: { id: createdCp.id },
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
    data: UpdateCp,
  ): Promise<Partial<Cp> | null> => {
    try {
      let value: string | boolean = false

      if (data.value) {
        value = GeneralValidator.validateMoneyString(data.value ? data.value : '') // valor que falha
        if (!value) {
          throw new ApiError(401, "Informar um valor Pt-Br válido")
        }
      }

      const updateData: Partial<Cp> = {
        ...data,
        type: data.type ? ({ id: data.type } as Tcp) : undefined,
        supplier: data.supplier
          ? ({ id: data.supplier } as Partner)
          : undefined,
        value: value
          ? parseFloat(value)
          : undefined,
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
   * Remove logicamente uma conta (status = PaymentStatus.CANCELLED).
   *
   * @param id - Identificador.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      // Verifica se a conta existe
      const cp = await this.repository.findOne({ where: { id } });
      if (!cp) {
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
  public query = async (data: QueryCp): Promise<Cp[]> => {
    try {
      const where: FindOptionsWhere<Cp> = {};

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

      if (data.type) {
        where.type = { name: Like(`%${data.type}%`) };
      }

      if (data.supplier) {
        where.supplier = Like(`%${data.supplier}%`);
      }

      if (data.due) {
        const updatedDate = new Date(data.due);
        where.updatedAt = updatedDate;
      }

      if (data.obs) {
        where.obs = Like(`%${data.obs}%`);
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

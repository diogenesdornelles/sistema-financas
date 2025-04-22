import { BaseService } from "./base.service";
import { Cat, Cf, Cp, Cr, Tx, User } from "../entity/entities";
import { CreateTx, QueryTx, UpdateTx } from "../../../packages/dtos/tx.dto";
import {
  FindOptionsWhere,
  ILike,
  MoreThanOrEqual,
  Raw,
  Repository,
} from "typeorm";
import {
  PaymentStatus,
  TransactionSearchType,
  TransactionType,
} from "../../../packages/dtos/utils/enums";
import { AppDataSource } from "../config/db";

/**
 * Serviço para gerenciar transações financeiras.
 *
 * @export
 * @class TxService
 * @extends {BaseService<Tx, Tx, CreateTx, UpdateTx, QueryTx>}
 */
export class TxService extends BaseService<
  Tx,
  Tx,
  CreateTx,
  UpdateTx,
  QueryTx
> {
  private cpRepo: Repository<Cp>;
  private crRepo: Repository<Cr>;
  private cfRepo: Repository<Cf>;

  /**
   * Creates an instance of TxService.
   * @memberof TxService
   */
  constructor() {
    super(Tx);
    // Vai retornar os registros filhos...
    this.relations = { category: true, cf: true, cr: true, cp: true };
    this.cpRepo = AppDataSource.getRepository(Cp);
    this.crRepo = AppDataSource.getRepository(Cr);
    this.cfRepo = AppDataSource.getRepository(Cf);
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
      // insere o tipo de transação, de acordo com a presença de CR ou CP
      const updatedData = {
        ...data,
        type: data.cr ? TransactionType.ENTRY : TransactionType.OUTFLOW,
      };

      const newTx = this.repository.create({
        ...updatedData,
        user: { id: updatedData.user } as User,
        category: { id: updatedData.category } as Cat,
        cf: { id: updatedData.cf } as Cf,
        cp: { id: updatedData.cp } as Cp,
        cr: { id: updatedData.cr } as Cr,
        value: data.value ? parseFloat(data.value) : undefined,
      });

      const createdTx = await this.repository.save(newTx);

      // atualiza CP para pago e decrementa saldo em Cf
      if (updatedData.cp) {
        await this.cpRepo.update(updatedData.cp, {
          status: PaymentStatus.PAID,
        });
        await this.cfRepo.decrement(
          { id: updatedData.cf },
          "currentBalance",
          updatedData.value,
        );
      }
      // atualiza CR para pago e incrementa saldo em Cf
      if (updatedData.cr) {
        await this.crRepo.update(updatedData.cr, {
          status: PaymentStatus.PAID,
        });
        await this.cfRepo.increment(
          { id: updatedData.cf },
          "currentBalance",
          updatedData.value,
        );
      }

      return await this.repository.findOneOrFail({
        where: { id: createdTx.id },
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao criar transação: ${error}`);
    }
  };
  /**
   * Atualiza o status de pagamento de CP e CR.
   *
   * @private
   * @param {(string | undefined)} oldId
   * @param {(string | undefined)} newId
   * @param {(Repository<Cr> | Repository<Cp>)} repo
   * @return {*}  {Promise<void>}
   * @memberof TxService
   */
  private async updatePaymentStatus(
    oldId: string | undefined,
    newId: string | undefined,
    repo: Repository<Cr> | Repository<Cp>,
  ): Promise<void> {
    if (oldId && oldId !== newId) {
      // Retorna o antigo para "PENDING"
      await repo.update(oldId, { status: PaymentStatus.PENDING });
    }
    if (newId && oldId !== newId) {
      // Define o novo como "PAID"
      await repo.update(newId, { status: PaymentStatus.PAID });
    }
  }

  /**
   * Atualiza o saldo atual de uma conta financeira.
   *
   * @param oldCfId - ID do CF antigo.
   * @param newCfId - ID do CF novo.
   * @param value - Valor a ser atualizado.
   * @param repo - Repositório da conta financeira.
   */
  private async updateCurrentBalance(
    oldCfId: string | undefined,
    newCfId: string | undefined,
    value: number,
    repo: Repository<Cf>,
  ): Promise<void> {
    if (oldCfId && oldCfId !== newCfId) {
      // Decrementa o saldo do CF antigo
      await repo.decrement({ id: oldCfId }, "currentBalance", value);
    }
    if (newCfId && oldCfId !== newCfId) {
      // Incrementa o saldo do CF novo
      await repo.increment({ id: newCfId }, "currentBalance", value);
    }
  }

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
      const dbData = await this.repository.findOneBy({ id });
      if (!dbData) {
        throw new Error(`Transação com ID ${id} não encontrada.`);
      }

      const updateData: Partial<Tx> = {
        ...data,
        type: data.cr ? TransactionType.ENTRY : TransactionType.OUTFLOW,
        category: data.category ? ({ id: data.category } as Cat) : undefined,
        cf: data.cf ? ({ id: data.cf } as Cf) : undefined,
        cp: data.cp ? ({ id: data.cp } as Cp) : undefined,
        cr: data.cr ? ({ id: data.cr } as Cr) : undefined,
        value: data.value ? parseFloat(data.value) : undefined,
        tdate: data.tdate ? new Date(data.tdate) : undefined,
      };

      await this.repository.update({ id }, updateData);

      // Atualiza status de CP e CR
      await this.updatePaymentStatus(
        dbData.cp?.id,
        updateData.cp?.id,
        this.cpRepo,
      );
      await this.updatePaymentStatus(
        dbData.cr?.id,
        updateData.cr?.id,
        this.crRepo,
      );

      // Atualiza o saldo de CF
      if (updateData.value) {
        await this.updateCurrentBalance(
          dbData.cf?.id,
          updateData.cf?.id,
          updateData.value,
          this.cfRepo,
        );
      }

      return await this.repository.findOne({
        where: { id },
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(
        `Erro ao atualizar transação com ID ${id}: ${String(error)}`,
      );
    }
  };

  /**
   * Remove logicamente uma transação.
   *
   * @param id - Identificador da transação.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      // Verifica se a transação existe
      const transaction = await this.repository.findOne({ where: { id } });
      if (!transaction) {
        throw new Error(`Transação com ID ${id} não encontrada.`);
      }

      // Atualiza o status da transação para false (exclusão lógica)
      await this.repository.update({ id }, { status: false });

      // Atualiza os estados de CP e CR, se existirem
      if (transaction.cp) {
        await this.cpRepo.update(transaction.cp.id, {
          status: PaymentStatus.PENDING,
        });
        // incrementar o saldo da conta, pois a transação de pagar foi cancelada
        await this.cfRepo.increment({ id: transaction.cf.id }, "currentBalance", transaction.value);
      }
      if (transaction.cr) {
        await this.crRepo.update(transaction.cr.id, {
          status: PaymentStatus.PENDING,
        });
        // decrementar o saldo da conta, pois a transação de receber foi cancelada
        await this.cfRepo.decrement({ id: transaction.cf.id }, "currentBalance", transaction.value);
      }

      // Retorna true se a exclusão lógica foi bem-sucedida
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao remover transação com ID ${id}: ${String(error)}`,
      );
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
        where.id = Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :id`, {
          id: `%${data.id}%`,
        });
      }

      if (data.value) {
        const value = parseFloat(
          data.value,
        );
        if (!isNaN(value)) {
          where.value = MoreThanOrEqual(value);
        }
      }

      if (data.type && data.type !== TransactionSearchType.BOTH) {
        where.type = data.type as unknown as TransactionType;
      }

      if (data.cf) {
        where.cf = {
          id: Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :cfId`, {
            cfId: `%${data.cf}%`,
          }),
        };
      }

      if (data.cp) {
        where.cp = {
          id: Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :cpId`, {
            cpId: `%${data.cp}%`,
          }),
        };
      }

      if (data.cr) {
        where.cr = {
          id: Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :crId`, {
            crId: `%${data.cr}%`,
          }),
        };
      }

      if (data.description) {
        where.description = ILike(`%${data.description}%`);
      }

      if (data.category) {
        where.category = { name: ILike(`%${data.category}%`) };
      }

      if (data.obs) {
        where.obs = ILike(`%${data.obs}%`);
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

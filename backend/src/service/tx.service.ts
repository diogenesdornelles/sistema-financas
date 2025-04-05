import { BaseService } from "./base.service";
import { Cat, Cf, Tx, User } from "../entity/entities";
import { CreateTx, TxProps, UpdateTx } from "../../../packages/dtos/tx.dto";

export class TxService extends BaseService<Tx, TxProps, CreateTx, UpdateTx> {
  constructor() {
    super(Tx);
  }

  /**
   * Recupera todas as transações.
   */
  public getAll = async (): Promise<TxProps[]> => {
    try {
      return await this.repository.find({
        relations: ["category", "cf"],
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
  public getOne = async (id: string): Promise<TxProps | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["category", "cf"],
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
  public create = async (data: CreateTx): Promise<TxProps> => {
    try {
      const newTx = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        category: { id: data.category } as Cat,
        cf: { id: data.cf } as Cf,
        value: data.value ? parseFloat(data.value.replace(/\./g, "").replace(",", ".")) : undefined
      });

      const createdTx = await this.repository.save(newTx);

      return await this.repository.findOneOrFail({
        where: { id: createdTx.id },
        relations: ["category", "cf"],
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
  ): Promise<Partial<TxProps> | null> => {
    try {
      const updateData: Partial<Tx> = {
        ...data,
        category: data.category ? ({ id: data.category } as Cat) : undefined,
        cf: data.cf ? ({ id: data.cf } as Cf) : undefined,
        value: data.value ? parseFloat(data.value.replace(/\./g, "").replace(",", ".")) : undefined
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: ["category", "cf"],
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
}

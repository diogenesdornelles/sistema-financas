import { BaseService } from "./base.service";
import { Tcf } from "../entity/entities";
import { CreateTcf, UpdateTcf, TcfProps } from "../../../packages/dtos/tcf.dto";

export class TcfService extends BaseService<
  Tcf,
  TcfProps,
  CreateTcf,
  UpdateTcf
> {
  constructor() {
    super(Tcf);
  }

  /**
   * Recupera todos os tipos de contas.
   */
  public getAll = async (): Promise<TcfProps[]> => {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new Error(`Erro ao recuperar tipos de conta financeira: ${error}`);
    }
  };

  /**
   * Recupera um tipo de conta pelo identificador.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<TcfProps | null> => {
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
  public create = async (data: CreateTcf): Promise<TcfProps> => {
    try {
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
  ): Promise<Partial<TcfProps> | null> => {
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
}

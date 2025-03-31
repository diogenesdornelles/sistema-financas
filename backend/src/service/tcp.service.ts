import { BaseService } from "./base.service";
import { Tcp } from "../entity/entities";
import {
  CreateTcpDto,
  UpdateTcpDto,
  TcpResponseDto,
} from "../dtos/tcp.dto";

export class TcpService extends BaseService<
  Tcp,
  TcpResponseDto,
  CreateTcpDto,
  UpdateTcpDto
> {
  constructor() {
    super(Tcp);
  }

  /**
   * Recupera todos os tipos de contas.
   */
  public getAll = async (): Promise<TcpResponseDto[]> => {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new Error(`Erro ao recuperar tipos de conta: ${error}`);
    }
  };

  /**
   * Recupera um tipo de conta pelo identificador.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<TcpResponseDto | null> => {
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
  public create = async (data: CreateTcpDto): Promise<TcpResponseDto> => {
    try {
      const createdTcf = await this.repository.save(this.repository.create(data));
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
    data: UpdateTcpDto,
  ): Promise<Partial<TcpResponseDto> | null> => {
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
}

import { BaseService } from "./base.service";
import { Cp, CPStatus, Partner, Tcp, User } from "../entity/entities";
import {
  CreateCpDto,
  UpdateCpDto,
  CpResponseDto,
} from "../dtos/cp.dto";

export class CpService extends BaseService<
  Cp,
  CpResponseDto,
  CreateCpDto,
  UpdateCpDto
> {
  constructor() {
    super(Cp);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<CpResponseDto[]> => {
    try {
      return await this.repository.find({
        relations: ["type", "supplier"],
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
  public getOne = async (id: string): Promise<CpResponseDto | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["type", "supplier"],
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
  public create = async (data: CreateCpDto): Promise<CpResponseDto> => {
    try {
      const newCp = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcp,
        supplier: { id: data.supplier } as Partner,
      });

      const createdCp = await this.repository.save(newCp);

      return await this.repository.findOneOrFail({
        where: { id: createdCp.id },
        relations: ["type", "supplier"],
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
    data: UpdateCpDto,
  ): Promise<Partial<CpResponseDto> | null> => {
    try {
      const updateData: Partial<Cp> = {
        ...data,
        user: data.user ? ({ id: data.user } as User) : undefined,
        type: data.type ? ({ id: data.type } as Tcp) : undefined,
        supplier: data.supplier ? ({ id: data.supplier } as Partner) : undefined,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: ["type", "supplier"],
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar conta com ID ${id}: ${error}`);
    }
  };

  /**
   * Remove logicamente uma conta (status = CPStatus.CANCELLED).
   *
   * @param id - Identificador.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: CPStatus.CANCELLED });
      const updatedCp = await this.repository.findOne({ where: { id } });
      return updatedCp?.status === CPStatus.CANCELLED;
    } catch (error) {
      throw new Error(`Erro ao remover conta com ID ${id}: ${error}`);
    }
  };
}

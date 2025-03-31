import { BaseService } from "./base.service";
import { Cf, Tcf, User } from "../entity/entities";
import {
  CreateCfDto,
  UpdateCfDto,
  CfResponseDto,
} from "../dtos/cf.dto";

export class CfService extends BaseService<
  Cf,
  CfResponseDto,
  CreateCfDto,
  UpdateCfDto
> {
  constructor() {
    super(Cf);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<CfResponseDto[]> => {
    try {
      const cfs = await this.repository.find({ relations: ["type"] });
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
  public getOne = async (id: string): Promise<CfResponseDto | null> => {
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
  public create = async (data: CreateCfDto): Promise<CfResponseDto> => {
    try {
      const cf = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcf,
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
    data: UpdateCfDto,
  ): Promise<Partial<CfResponseDto> | null> => {
    try {
      const updateData: Partial<Cf> = {
        ...data,
        user: data.user ? ({ id: data.user } as User) : undefined,
        type: data.type ? ({ id: data.type } as Tcf) : undefined,
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
}

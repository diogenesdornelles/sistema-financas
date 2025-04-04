import { BaseService } from "./base.service";
import { Cf, Tcf, User } from "../entity/entities";
import { CreateCf, UpdateCf, CfProps } from "../../../packages/dtos/cf.dto";

export class CfService extends BaseService<Cf, CfProps, CreateCf, UpdateCf> {
  constructor() {
    super(Cf);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<CfProps[]> => {
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
  public getOne = async (id: string): Promise<CfProps | null> => {
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
  public create = async (data: CreateCf): Promise<CfProps> => {
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
    data: UpdateCf,
  ): Promise<Partial<CfProps> | null> => {
    try {
      const updateData: Partial<Cf> = {
        ...data,
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

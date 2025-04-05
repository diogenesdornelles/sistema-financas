import { BaseService } from "./base.service";
import { Cp, Partner, Tcp, Tx, User } from "../entity/entities";
import { CreateCp, UpdateCp, CpProps } from "../../../packages/dtos/cp.dto";
import { CPStatus } from "../../../packages/dtos/utils/enums";

export class CpService extends BaseService<Cp, CpProps, CreateCp, UpdateCp> {
  constructor() {
    super(Cp);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<CpProps[]> => {
    try {
      return await this.repository.find({
        relations: ["type", "supplier", "tx"],
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
  public getOne = async (id: string): Promise<CpProps | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["type", "supplier", "tx"],
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
  public create = async (data: CreateCp): Promise<CpProps> => {
    try {
      const newCp = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcp,
        supplier: { id: data.supplier } as Partner,
        tx: { id: data.tx } as Tx,
        value: data.value ? parseFloat(data.value.replace(/\./g, "").replace(",", ".")) : undefined
      });

      const createdCp = await this.repository.save(newCp);

      return await this.repository.findOneOrFail({
        where: { id: createdCp.id },
        relations: ["type", "supplier", "tx"],
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
  ): Promise<Partial<CpProps> | null> => {
    try {
      const updateData: Partial<Cp> = {
        ...data,
        type: data.type ? ({ id: data.type } as Tcp) : undefined,
        supplier: data.supplier
          ? ({ id: data.supplier } as Partner)
          : undefined,
        tx: data.tx ? ({ id: data.tx } as Tx) : undefined,
        value: data.value ? parseFloat(data.value.replace(/\./g, "").replace(",", ".")) : undefined
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: ["type", "supplier", "tx"],
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

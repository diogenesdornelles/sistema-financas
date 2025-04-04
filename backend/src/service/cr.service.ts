import { BaseService } from "./base.service";
import { Cr, Partner, Tcr, Tx, User } from "../entity/entities";
import { CreateCr, UpdateCr, CrProps } from "../../../packages/dtos/cr.dto";
import { PaymentStatus } from "../../../packages/dtos/utils/enums";

export class CrService extends BaseService<Cr, CrProps, CreateCr, UpdateCr> {
  constructor() {
    super(Cr);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<CrProps[]> => {
    try {
      return await this.repository.find({
        relations: ["type", "customer", "tx"],
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
  public getOne = async (id: string): Promise<CrProps | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["type", "customer", "tx"],
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
  public create = async (data: CreateCr): Promise<CrProps> => {
    try {
      const newCr = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcr,
        customer: { id: data.customer } as Partner,
        tx: { id: data.tx } as Tx,
      });

      const createdCr = await this.repository.save(newCr);

      return await this.repository.findOneOrFail({
        where: { id: createdCr.id },
        relations: ["type", "customer"],
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
  ): Promise<Partial<CrProps> | null> => {
    try {
      const updateData: Partial<Cr> = {
        ...data,
        type: data.type ? ({ id: data.type } as Tcr) : undefined,
        customer: data.customer
          ? ({ id: data.customer } as Partner)
          : undefined,
        tx: data.tx ? ({ id: data.tx } as Tx) : undefined,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: ["type", "customer", "tx"],
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
      await this.repository.update({ id }, { status: PaymentStatus.CANCELLED });
      const updatedCr = await this.repository.findOne({ where: { id } });
      return updatedCr?.status === PaymentStatus.CANCELLED;
    } catch (error) {
      throw new Error(`Erro ao remover conta com ID ${id}: ${error}`);
    }
  };
}

import { BaseService } from "./base.service";
import { Cr, Partner, Tcr, User, PaymentStatus } from "../entity/entities";
import {
  CreateCrDto,
  UpdateCrDto,
  CrResponseDto,
} from "../dtos/cr.dto";

export class CrService extends BaseService<
  Cr,
  CrResponseDto,
  CreateCrDto,
  UpdateCrDto
> {
  constructor() {
    super(Cr);
  }

  /**
   * Recupera todas as contas.
   */
  public getAll = async (): Promise<CrResponseDto[]> => {
    try {
      return await this.repository.find({
        relations: ["type", "customer"],
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
  public getOne = async (id: string): Promise<CrResponseDto | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ["type", "customer"],
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
  public create = async (data: CreateCrDto): Promise<CrResponseDto> => {
    try {
      const newCr = this.repository.create({
        ...data,
        user: { id: data.user } as User,
        type: { id: data.type } as Tcr,
        customer: { id: data.customer } as Partner,
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
    data: UpdateCrDto,
  ): Promise<Partial<CrResponseDto> | null> => {
    try {
      const updateData: Partial<Cr> = {
        ...data,
        user: data.user ? ({ id: data.user } as User) : undefined,
        type: data.type ? ({ id: data.type } as Tcr) : undefined,
        customer: data.customer ? ({ id: data.customer } as Partner) : undefined,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: ["type", "customer"],
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

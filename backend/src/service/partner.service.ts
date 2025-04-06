import { BaseService } from "./base.service";
import { Partner, User } from "../entity/entities";
import {
  CreatePartner,
  PartnerProps,
  QueryPartner,
  UpdatePartner,
} from "../../../packages/dtos/partner.dto";
import { FindOptionsWhere, Like } from "typeorm";

export class PartnerService extends BaseService<
  Partner,
  PartnerProps,
  CreatePartner,
  UpdatePartner,
  QueryPartner
> {
  constructor() {
    super(Partner);
  }

  /**
   * Recupera todos os parceiros.
   */
  public getAll = async (): Promise<PartnerProps[]> => {
    try {
      return await this.repository.find({
        relations: [],
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar parceiros: ${error}`);
    }
  };

  /**
   * Recupera um parceiro pelo id.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<PartnerProps | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: [],
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar parceiro com ID ${id}: ${error}`);
    }
  };

  /**
   * Cria um novo parceiro.
   *
   * @param data - Dados para criação.
   */
  public create = async (data: CreatePartner): Promise<PartnerProps> => {
    try {
      const newPartner = this.repository.create({
        ...data,
        user: { id: data.user } as User,
      });

      const createdPartner = await this.repository.save(newPartner);

      return await this.repository.findOneOrFail({
        where: { id: createdPartner.id },
        relations: [],
      });
    } catch (error) {
      throw new Error(`Erro ao criar parceiro: ${error}`);
    }
  };

  /**
   * Atualiza um parceiro existente.
   *
   * @param id - Identificador.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdatePartner,
  ): Promise<Partial<PartnerProps> | null> => {
    try {
      const updateData: Partial<Partner> = {
        ...data,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: [],
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar parceiro com ID ${id}: ${error}`);
    }
  };

  /**
   * Remove logicamente um parceiro.
   *
   * @param id - Identificador.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: false });
      const updatedPartner = await this.repository.findOne({ where: { id } });
      return updatedPartner?.status === false;
    } catch (error) {
      throw new Error(`Erro ao remover parceiro com ID ${id}: ${error}`);
    }
  };

  /**
   * Realiza um filtro.
   *
   * @param data - Dados para busca.
   */
  public query = async (data: QueryPartner): Promise<PartnerProps[]> => {
    try {
      const where: FindOptionsWhere<Partner> = {};

      if (data.name) {
        where.name = Like(`%${data.name}%`);
      }

      if (data.type) {
        where.type = data.type;
      }

      if (data.cod) {
        where.cod = Like(`%${data.cod}%`);
      }

      if (data.obs) {
        where.obs = Like(`%${data.obs}%`);
      }

      if (data.status !== undefined) {
        where.status = data.status;
      }

      if (data.createdAt) {
        const updatedDate = new Date(data.createdAt);
        where.updatedAt = updatedDate;
      }

      if (data.updatedAt) {
        const updatedDate = new Date(data.updatedAt);
        where.updatedAt = updatedDate;
      }

      return await this.repository.find({
        where,
        relations: [],
      });
    } catch (error) {
      throw new Error(`Erro ao filtrar contas a pagar: ${error}`);
    }
  };
}

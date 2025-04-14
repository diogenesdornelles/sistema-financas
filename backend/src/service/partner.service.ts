import { BaseService } from "./base.service";
import { Partner, User } from "../entity/entities";
import {
  CreatePartner,
  QueryPartner,
  UpdatePartner,
} from "../../../packages/dtos/partner.dto";
import { FindOptionsWhere, Like, MoreThanOrEqual, Raw } from "typeorm";
import {
  PartnerSearchType,
  PartnerType,
} from "../../../packages/dtos/utils/enums";

export class PartnerService extends BaseService<
  Partner,
  Partner,
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
  public getAll = async (): Promise<Partner[]> => {
    try {
      return await this.repository.find({
        where: { status: true },
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao recuperar parceiros: ${error}`);
    }
  };

  /**
   * Recupera 10 parceiros, com skip.
   */
  public getMany = async (skip: number): Promise<Partner[]> => {
    try {
      return await this.repository.find({
        where: { status: true },
        skip,
        take: 10,
        relations: this.relations,
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
  public getOne = async (id: string): Promise<Partner | null> => {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: this.relations,
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
  public create = async (data: CreatePartner): Promise<Partner> => {
    try {
      const newPartner = this.repository.create({
        ...data,
        user: { id: data.user } as User,
      });

      const createdPartner = await this.repository.save(newPartner);

      return await this.repository.findOneOrFail({
        where: { id: createdPartner.id },
        relations: this.relations,
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
  ): Promise<Partial<Partner> | null> => {
    try {
      const updateData: Partial<Partner> = {
        ...data,
      };

      await this.repository.update({ id }, updateData);

      return await this.repository.findOne({
        where: { id },
        relations: this.relations,
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
  public query = async (data: QueryPartner): Promise<Partner[]> => {
    try {
      const where: FindOptionsWhere<Partner> = {};

      if (data.id) {
        where.id = Raw((alias) => `${alias}::text ILIKE :id`, { id: `%${data.id}%` });
      }

      if (data.name) {
        where.name = Like(`%${data.name}%`);
      }

      if (data.type && data.type !== PartnerSearchType.PFPJ) {
        where.type = data.type as unknown as PartnerType;
      }

      if (data.cod) {
        where.cod = Like(`%${data.cod}%`);
      }

      if (data.obs) {
        where.obs = Like(`%${data.obs}%`);
      }

      if (data.status) {
        where.status = data.status;
      }

      if (data.updatedAt) {
        const updatedDate = new Date(data.updatedAt);
        where.updatedAt = MoreThanOrEqual(updatedDate);
      }

      if (data.createdAt) {
        const updatedDate = new Date(data.createdAt);
        where.createdAt = MoreThanOrEqual(updatedDate);
      }

      return await this.repository.find({
        where,
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao filtrar contas a pagar: ${error}`);
    }
  };
}

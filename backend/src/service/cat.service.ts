import { CreateCat, QueryCat, UpdateCat } from '@monorepo/packages';
import { FindOptionsWhere, ILike, MoreThanOrEqual, Raw } from 'typeorm';
import { Cat, User } from '../entity/entities.js';
import { BaseService } from './base.service.js';

/**
 *
 *
 * @export
 * @class CatService
 * @extends {BaseService<Cat, Cat, CreateCat, UpdateCat, QueryCat>}
 */
export class CatService extends BaseService<
  Cat,
  Cat,
  CreateCat,
  UpdateCat,
  QueryCat
> {
  constructor() {
    super(Cat);
  }

  /**
   * Recupera todos os ativos.
   */
  public getAll = async (): Promise<Cat[]> => {
    try {
      const cats = await this.repository.find({
        relations: this.relations,
        where: { status: true },
      });
      return cats;
    } catch (error) {
      throw new Error(`Erro ao recuperar categorias: ${error}`);
    }
  };
  /**
   * Recupera 10 ativos com paginação.
   *
   * @param {number} [skip=0]
   * @memberof CatService
   */
  public getMany = async (skip = 0): Promise<Cat[]> => {
    try {
      const cats = await this.repository.find({
        where: { status: true },
        skip,
        take: 10,
        relations: this.relations,
      });
      return cats;
    } catch (error) {
      throw new Error(`Erro ao recuperar categorias: ${error}`);
    }
  };

  /**
   * Recupera um pelo identificador.
   *
   * @param id - Identificador.
   */
  public getOne = async (id: string): Promise<Cat | null> => {
    try {
      const cat = await this.repository.findOne({
        where: { id },
        relations: this.relations,
      });
      return cat;
    } catch (error) {
      throw new Error(`Erro ao recuperar categoria com ID ${id}: ${error}`);
    }
  };

  /**
   * Cria um novo registro.
   *
   * @param data - Dados para criação.
   */
  public create = async (data: CreateCat): Promise<Cat> => {
    try {
      const cat = this.repository.create({
        ...data,
        user: { id: data.user } as User,
      });
      return await this.repository.save(cat);
    } catch (error) {
      throw new Error(`Erro ao criar categoria: ${error}`);
    }
  };

  /**
   * Atualiza um existente.
   *
   * @param id - Identificador.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdateCat,
  ): Promise<Partial<Cat> | null> => {
    try {
      const updateData: Partial<Cat> = {
        ...data,
      };

      await this.repository.update({ id }, updateData);
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Erro ao atualizar categoria com ID ${id}: ${error}`);
    }
  };

  /**
   * Remove logicamente um registro (define status como false).
   *
   * @param id - Identificador.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: false });
      const updatedCat = await this.repository.findOne({ where: { id } });
      return !!updatedCat && !updatedCat.status;
    } catch (error) {
      throw new Error(`Erro ao remover categoria com ID ${id}: ${error}`);
    }
  };

  /**
   * Realiza um filtro.
   *
   * @param data - Dados para busca.
   */
  public query = async (data: QueryCat): Promise<Cat[]> => {
    try {
      // Inicia o query builder
      const where: FindOptionsWhere<Cat> = {};

      // id é UUID type, precisa converter para string para admitir consulta parcial
      if (data.id) {
        where.id = Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :id`, {
          id: `%${data.id}%`,
        });
      }

      // As buscas são parciais e case insensitive
      if (data.name) {
        where.name = ILike(`%${data.name}%`);
      }

      if (data.description) {
        where.description = ILike(`%${data.description}%`);
      }

      if (data.obs) {
        where.obs = ILike(`%${data.obs}%`);
      }

      if (data.status) {
        where.status = data.status;
      }

      // Retorna apenas os registros que foram criados ou atualizados a partir da data informada
      if (data.updatedAt) {
        const updatedDate = new Date(data.updatedAt);
        where.updatedAt = MoreThanOrEqual(updatedDate);
      }

      if (data.createdAt) {
        const updatedDate = new Date(data.createdAt);
        where.createdAt = MoreThanOrEqual(updatedDate);
      }

      return await this.repository.find({ where });
    } catch (error) {
      throw new Error(`Erro ao filtrar categorias: ${error}`);
    }
  };
}

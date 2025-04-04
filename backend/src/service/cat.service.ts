import { BaseService } from "./base.service";
import { Cat, User } from "../entity/entities";
import { CreateCat, UpdateCat, CatProps } from "../../../packages/dtos/cat.dto";

export class CatService extends BaseService<
  Cat,
  CatProps,
  CreateCat,
  UpdateCat
> {
  constructor() {
    super(Cat);
  }

  /**
   * Recupera todos.
   */
  public getAll = async (): Promise<CatProps[]> => {
    try {
      const cats = await this.repository.find({ relations: [] });
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
  public getOne = async (id: string): Promise<CatProps | null> => {
    try {
      const cat = await this.repository.findOne({
        where: { id },
        relations: [],
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
  public create = async (data: CreateCat): Promise<CatProps> => {
    try {
      const cat = this.repository.create({
        ...data,
        user: { id: data.user },
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
  ): Promise<Partial<CatProps> | null> => {
    try {
      const updateData: Partial<Cat> = {
        ...data
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
}

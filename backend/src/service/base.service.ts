import { Repository, EntityTarget, ObjectLiteral } from "typeorm";
import { AppDataSource } from "../config/db";

/**
 * Classe abstrata de serviço base que fornece a estrutura para operações CRUD.
 *
 * @template T - Entidade do TypeORM.
 * @template ResponseDTO - DTO de resposta.
 * @template CreateDTO - DTO para criação.
 * @template UpdateDTO - DTO para atualização.
 */
export abstract class BaseService<
  T extends ObjectLiteral,
  ResponseDTO,
  CreateDTO,
  UpdateDTO,
> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  /**
   * Retorna todos os registros.
   */
  public abstract getAll(): Promise<ResponseDTO[]>;

  /**
   * Retorna um registro pelo identificador.
   *
   * @param id - Identificador do registro.
   */
  public abstract getOne(id: string): Promise<ResponseDTO | null>;

  /**
   * Cria um novo registro.
   *
   * @param data - Dados para criação.
   */
  public abstract create(data: CreateDTO): Promise<ResponseDTO | null>;

  /**
   * Atualiza um registro existente.
   *
   * @param id - Identificador do registro.
   * @param data - Dados para atualização.
   */
  public abstract update(
    id: string,
    data: UpdateDTO,
  ): Promise<Partial<ResponseDTO> | null>;

  /**
   * Deleta um registro.
   *
   * @param id - Identificador do registro.
   */
  public abstract delete(id: string): Promise<boolean>;
}

import {
  CreateUser,
  QueryUser,
  RoleSearchType,
  RoleType,
  UpdateUser,
} from "@monorepo/packages";
import { FindOptionsWhere, ILike, MoreThanOrEqual, Raw } from "typeorm";
import { User } from "../entity/entities.js";
import hashPassword from "../utils/hashPwd.util.js";
import { BaseService } from "./base.service.js";

export class UserService extends BaseService<
  User,
  Omit<User, "pwd">,
  CreateUser,
  UpdateUser,
  QueryUser
> {
  private readonly selection: Record<string, boolean>;
  constructor() {
    super(User);
    this.selection = {
      id: true,
      name: true,
      status: true,
      surname: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      cpf: true,
      pwd: false,
    };
  }

  /**
   * Recupera todos os usuários ativos.
   */
  public getAll = async (): Promise<User[]> => {
    try {
      const users = await this.repository.find({
        select: this.selection,
        where: { status: true },
        relations: this.relations,
      });
      return users;
    } catch (error) {
      throw new Error(`Erro ao obter usuários: ${error}`);
    }
  };

  /**
   * Recupera 10 usuários ativos, com skip.
   */
  public getMany = async (skip: number): Promise<User[]> => {
    try {
      const users = await this.repository.find({
        where: { status: true },
        select: this.selection,
        skip,
        take: 10,
        relations: this.relations,
      });
      return users;
    } catch (error) {
      throw new Error(`Erro ao obter usuários: ${error}`);
    }
  };

  /**
   * Recupera um usuário pelo identificador.
   *
   * @param id - Identificador do usuário.
   */
  public getOne = async (id: string): Promise<User | null> => {
    try {
      const user = await this.repository.findOne({
        where: { id },
        select: this.selection,
        relations: this.relations,
      });
      return user;
    } catch (error) {
      throw new Error(`Erro ao obter usuário com ID ${id}: ${error}`);
    }
  };

  /**
   * Cria um novo usuário.
   *
   * @param data - Dados para criação do usuário.
   */
  public create = async (data: CreateUser): Promise<Omit<User, "pwd">> => {
    try {
      // criptografa a senha
      const hashedPwd = await hashPassword(data.pwd);
      // atualiza user
      const user = this.repository.create({ ...data, pwd: hashedPwd });
      const createdUser = await this.repository.save(user);

      // Evita retorno da senha
      const { pwd, ...userWithoutPwd } = createdUser;
      return userWithoutPwd;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error}`);
    }
  };

  /**
   * Atualiza um usuário existente.
   *
   * @param id - Identificador do usuário.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdateUser,
  ): Promise<Partial<User> | null> => {
    try {
      if (data.pwd) {
        data.pwd = await hashPassword(data.pwd);
      }
      await this.repository.update({ id }, data);
      const updatedUser = await this.repository.findOne({
        where: { id },
        select: this.selection,
        relations: this.relations,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário com ID ${id}: ${error}`);
    }
  };

  /**
   * Remove logicamente um usuário (status=false).
   *
   * @param id - Identificador do usuário.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: false });
      const updatedUser = await this.repository.findOne({ where: { id } });
      return !!updatedUser && !updatedUser.status;
    } catch (error) {
      throw new Error(`Erro ao remover usuário com ID ${id}: ${error}`);
    }
  };
  /**
   * Realiza um filtro.
   *
   * @param data - Dados para busca.
   */
  public query = async (data: QueryUser): Promise<User[]> => {
    try {
      const where: FindOptionsWhere<User> = {};

      if (data.id) {
        where.id = Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :id`, {
          id: `%${data.id}%`,
        });
      }

      if (data.name) {
        where.name = ILike(`%${data.name}%`);
      }

      if (data.surname) {
        where.surname = ILike(`%${data.surname}%`);
      }

      if (data.cpf) {
        where.cpf = ILike(`%${data.cpf}%`);
      }

      if (data.status) {
        where.status = data.status;
      }

      if (data.role && data.role !== RoleSearchType.ALL) {
        where.role = data.role as unknown as RoleType;
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
        select: this.selection,
        relations: this.relations,
      });
    } catch (error) {
      throw new Error(`Erro ao filtrar usuários: ${error}`);
    }
  };
}

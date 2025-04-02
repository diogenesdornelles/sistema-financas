import { BaseService } from "./base.service";
import { User } from "../entity/entities";
import {
  CreateUser,
  UpdateUser,
  UserProps,
} from "../../../packages/dtos/user.dto";
import hashPassword from "../utils/hash-pwd.util";

export class UserService extends BaseService<
  User,
  UserProps,
  CreateUser,
  UpdateUser
> {
  constructor() {
    super(User);
  }

  /**
   * Recupera todos os usuários.
   */
  public getAll = async (): Promise<UserProps[]> => {
    try {
      const users = await this.repository.find({
        select: ["id", "name", "status", "surname", "createdAt", "updatedAt"],
        relations: [],
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
  public getOne = async (id: string): Promise<UserProps | null> => {
    try {
      const user = await this.repository.findOne({
        where: { id },
        select: ["id", "name", "status", "surname", "createdAt", "updatedAt"],
        relations: [],
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
  public create = async (data: CreateUser): Promise<UserProps> => {
    try {
      const hashedPwd = await hashPassword(data.pwd);
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
  ): Promise<Partial<UserProps> | null> => {
    try {
      if (data.pwd) {
        data.pwd = await hashPassword(data.pwd);
      }
      await this.repository.update({ id }, data);
      const updatedUser = await this.repository.findOne({
        where: { id },
        select: ["id", "name", "status", "surname", "createdAt", "updatedAt"],
        relations: [],
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
}

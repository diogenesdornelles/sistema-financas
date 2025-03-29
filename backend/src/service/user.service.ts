import { BaseService } from "./base.service";
import { User } from "../entity/user";
import { CreateUserDTO } from "../dtos/create/create-user.dto";
import { UpdateUserDTO } from "../dtos/update/update-user.dto";
import { ResponseUserDTO } from "../dtos/response/response-user.dto";
import hashPassword from "../utils/hash-pwd.util";
import { FindOneOptions } from "typeorm";

type t = FindOneOptions

export class UserService extends BaseService<
  User,
  ResponseUserDTO,
  CreateUserDTO,
  UpdateUserDTO
> {
  constructor() {
    super(User);
  }

  /**
   * Recupera todos os usuários.
   */
  public getAll = async (): Promise<ResponseUserDTO[]> => {
    const users = await this.repository.find({ select: { senha: false } });
    return users;
  };

  /**
   * Recupera um usuário pelo identificador.
   *
   * @param id - Identificador do usuário.
   */
  public getOne = async (id: string): Promise<ResponseUserDTO | null> => {
    const user = await this.repository.findOne({ where: { id }, select: { senha: false } });
    return user;
  };

  /**
   * Cria um novo usuário.
   *
   * @param data - Dados para criação do usuário.
   */
  public create = async (data: CreateUserDTO): Promise<ResponseUserDTO> => {
    data.senha = await hashPassword(data.senha)
    const user = this.repository.create(data);
    const createdUser = await this.repository.save(user);
    return createdUser;
  };

  /**
   * Atualiza um usuário existente.
   *
   * @param id - Identificador do usuário.
   * @param data - Dados para atualização.
   */
  public update = async (
    id: string,
    data: UpdateUserDTO,
  ): Promise<Partial<ResponseUserDTO> | null> => {
    if (data.senha) {
      data.senha = await hashPassword(data.senha)
    }
    await this.repository.update({ id }, data);
    const updatedUser = await this.repository.findOne({ where: { id } });
    return updatedUser;
  };

  /**
   * Remove um usuário que esteja ativo.
   *
   * @param id - Identificador do usuário.
   */
  public delete = async (id: string): Promise<boolean> => {
    try {
      await this.repository.update({ id }, { status: false });
      const updatedUser = await this.repository.findOne({ where: { id } });
      if (updatedUser) return true;
      return false;
    } catch (error) {
      return false;
    }
  };
}

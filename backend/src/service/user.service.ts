import { BaseService } from "./base.service";
import { User } from "../entity/entities";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "../dtos/user.dto";
import hashPassword from "../utils/hash-pwd.util";

export class UserService extends BaseService<
  User,
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto
> {
  constructor() {
    super(User);
  }

  /**
   * Recupera todos os usuários.
   */
  public getAll = async (): Promise<UserResponseDto[]> => {
    const users = await this.repository.find({ select: { pwd: false } });
    return users;
  };

  /**
   * Recupera um usuário pelo identificador.
   *
   * @param id - Identificador do usuário.
   */
  public getOne = async (id: string): Promise<UserResponseDto | null> => {
    const user = await this.repository.findOne({
      where: { id },
      select: { pwd: false },
    });
    return user;
  };

  /**
   * Cria um novo usuário.
   *
   * @param data - Dados para criação do usuário.
   */
  public create = async (data: CreateUserDto): Promise<UserResponseDto> => {
    data.pwd = await hashPassword(data.pwd);
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
    data: UpdateUserDto,
  ): Promise<Partial<UserResponseDto> | null> => {
    if (data.pwd) {
      data.pwd = await hashPassword(data.pwd);
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
      await this.repository.update({ id }, { status: true });
      const updatedUser = await this.repository.findOne({ where: { id } });
      if (updatedUser) return true;
      return false;
    } catch (error) {
      return false;
    }
  };
}

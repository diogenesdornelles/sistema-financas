import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { BaseService } from './base.service'
import { User } from '../entity/user'
import { ResponseTokenDTO } from '../dtos/response/response-token.dto'
import { CreateTokenDTO } from '../dtos/create/create-token.dto'
import { UpdateTokenDTO } from '../dtos/update/update-token.dto'
import ms from 'ms'
import { ApiError } from '../utils/api-error.util'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY || 'r34534erfefgdf7576ghfg4455456'
const EXPIRES_IN = process.env.EXPIRES_IN || '2d'

export default class LoginService extends BaseService<User,
  ResponseTokenDTO,
  CreateTokenDTO,
  UpdateTokenDTO
> {
  constructor() {
    super(User)
  }

  public create = async (data: CreateTokenDTO): Promise<ResponseTokenDTO> => {
    // Find employee
    const dbFuncionario = await this.repository.findOne({
      where: { cpf: data.cpf },
    })

    if (!dbFuncionario) {
      throw new ApiError(400, 'CPF not found or is not correct')
    }
    // If match, configure token
    if (bcrypt.compareSync(data.senha, dbFuncionario.senha)) {
      const token = jwt.sign(
        {
          cpf: dbFuncionario.cpf,
          nome: dbFuncionario.nome,
        },
        SECRET_KEY,
        {
          expiresIn: EXPIRES_IN as ms.StringValue,
        },
      )

      return {
        user: {
          cpf: dbFuncionario.cpf,
          nome: dbFuncionario.nome,
          id: dbFuncionario.id
        },
        token: token,
      }
    } else {
      throw new Error('Password is not correct')
    }
  }

  public getAll(): Promise<ResponseTokenDTO[]> {
    throw new Error('Method not implemented.')
  }
  public getOne(pk: string): Promise<ResponseTokenDTO | null> {
    throw new Error('Method not implemented.')
  }
  public update(
    pk: string,
    data: UpdateTokenDTO,
  ): Promise<Partial<ResponseTokenDTO>> {
    throw new Error('Method not implemented.')
  }
  public delete(pk: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}

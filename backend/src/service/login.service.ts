import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { BaseService } from "./base.service";
import { User } from "../entity/entities";

import ms from "ms";
import { ApiError } from "../utils/api-error.util";
import {
  CreateToken,
  TokenProps,
  UpdateToken,
} from "../../../packages/dtos/token.dto";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "r34534erfefgdf7576ghfg4455456";
const EXPIRES_IN = process.env.EXPIRES_IN || "2d";

export default class LoginService extends BaseService<
  User,
  TokenProps,
  CreateToken,
  UpdateToken,
  Record<any, any>
> {
  constructor() {
    super(User);
  }

  public create = async (data: CreateToken): Promise<TokenProps> => {
    const dbUser = await this.repository.findOne({
      where: { cpf: data.cpf, status: true },
    });

    if (!dbUser) {
      throw new ApiError(400, "CPF not found or is not correct");
    }
    // If match, configure token
    if (bcrypt.compareSync(data.pwd, dbUser.pwd)) {
      const token = jwt.sign(
        {
          cpf: dbUser.cpf,
          name: dbUser.name,
        },
        SECRET_KEY,
        {
          expiresIn: EXPIRES_IN as ms.StringValue,
        },
      );

      return {
        user: {
          cpf: dbUser.cpf,
          name: dbUser.name,
          id: dbUser.id,
        },
        token: token,
      };
    } else {
      throw new Error("Password is not correct");
    }
  };

  public getAll(): Promise<TokenProps[]> {
    throw new Error("Method not implemented.");
  }

  public getMany(skip: number): Promise<TokenProps[]> {
    throw new Error("Method not implemented.");
  }
  public getOne(pk: string): Promise<TokenProps | null> {
    throw new Error("Method not implemented.");
  }
  public update(pk: string, data: UpdateToken): Promise<Partial<TokenProps>> {
    throw new Error("Method not implemented.");
  }
  public delete(pk: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public query(data: Record<any, any>): Promise<TokenProps[] | null> {
    return Promise.resolve(null);
  }
}

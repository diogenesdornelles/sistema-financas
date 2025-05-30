import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../entity/entities.js";
import { BaseService } from "./base.service.js";

import { CreateToken, TokenProps, UpdateToken } from "@monorepo/packages";
import ms from "ms";
import { ApiError } from "../utils/apiError.util.js";

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

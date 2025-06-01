import { NextFunction, Request, Response } from 'express';
import { BaseController } from './base.controller.js';
import jwt from 'jsonwebtoken';
import { CreateToken, createTokenSchema, TokenProps } from '@monorepo/packages';
import LoginService from '../service/login.service.js';
import { LogService } from '../service/log.service.js';

/**
 * Controla o fluxo de requisições e respostas de Login
 *
 * @export
 * @class LoginController
 * @extends {BaseController<LoginService>}
 */
export default class LoginController extends BaseController<LoginService> {
  constructor() {
    super(new LoginService());
  }
  /**
   * Gerencia a criação de um token
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof LoginController
   */
public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userAgent = req.headers['user-agent'] || null;
    const ip = req.ip || (req.socket.remoteAddress as string) || null;
    let validatedData: CreateToken;

    try {
      validatedData = createTokenSchema.parse(req.body);
      const result: TokenProps = await this.service.create(validatedData);

      let expiredAt: Date | undefined;
      try {
        const decodedToken = jwt.decode(result.token) as { exp?: number };
        if (decodedToken && decodedToken.exp) {
          expiredAt = new Date(decodedToken.exp * 1000);
        }
      } catch (decodeError) {
        console.error('Erro ao decodificar token para log:', decodeError);
      }

      await LogService.create({
        userId: result.user.id,
        action: 'LOGIN_SUCCESS',
        ip,
        userAgent,
        tokenIdentifier: result.token.slice(-10),
        expiredAt: expiredAt || null,
        details: { cpfAttempted: validatedData.cpf },
      });

      res.status(201).json(result);
      return;
    } catch (error: any) {
      const cpfAttempted = validatedData! ? validatedData!.cpf : req.body?.cpf || 'N/A';

      await LogService.create({
        userId: null,
        action: error.status === 400 || error.message === 'Password is not correct' || error.message.includes('CPF not found')
          ? 'LOGIN_FAILURE'
          : 'LOGIN_ERROR',
        ip,
        userAgent,
        details: {
          cpfAttempted: cpfAttempted,
          errorMessage: error.message,
          errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Stack apenas em dev
        },
      });
      next(error);
      return;
    }
  };
  /**
   * Gerencia a devolução de todos os tokens
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {*}  {Promise<void>}
   * @memberof LoginController
   */
  public getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public getMany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public getOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public query(req: Request, res: Response, next: NextFunction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

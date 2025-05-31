import { GeneralValidator } from '@monorepo/packages';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { z } from 'zod';
import { AuthPayloadInterface } from '../interfaces/AuthPayload.interface.js';
import { CustomRequestInterface } from '../interfaces/CustomRequest.interface.js';
import { ApiError } from '../utils/apiError.util.js';

dotenv.config();

const SECRET_KEY: Secret =
  process.env.SECRET_KEY || 'r34534erfefgdf7576ghfg4455456';

function sendErrorResponse(
  res: Response,
  statusCode: number,
  error: string,
  message: string,
  details?: any,
): void {
  res.status(statusCode).json({
    statusCode,
    error,
    message,
    details: details || null,
  });
}

export default class GeneralMiddleware {
  public static validateCpf = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    let { cpf } = req.params;
    if (GeneralValidator.validateCpf(cpf)) {
      next();
      return;
    }
    sendErrorResponse(
      res,
      400,
      'Bad Request',
      'Invalid CPF format. Please provide a valid CPF.',
    );
  };

  public static validateUUID = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    let { id } = req.params;
    if (GeneralValidator.validateUUID(id)) {
      next();
      return;
    }
    sendErrorResponse(
      res,
      400,
      'Bad Request',
      'Invalid UUID format. Please provide a valid UUID.',
    );
  };

  public static validateDateUntilPresent = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    let { date } = req.params;
    if (GeneralValidator.validateDateUntilPresent(date)) {
      next();
      return;
    }
    sendErrorResponse(
      res,
      400,
      'Bad Request',
      'Invalid DATE format. Please provide a valid DATE and until current date.',
    );
  };

  public static validateDatePostPresent = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    let { date } = req.params;
    if (GeneralValidator.validateDatePostPresent(date)) {
      next();
      return;
    }
    sendErrorResponse(
      res,
      400,
      'Bad Request',
      'Invalid DATE format. Please provide a valid DATE and until today or post.',
    );
  };

  public static errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    console.error('Error:', error);

    if (error instanceof z.ZodError) {
      console.error(
        `Validation error on ${req.method} resource:`,
        error.errors,
      );
      sendErrorResponse(
        res,
        400,
        'Validation Error',
        'Validation failed.',
        error.errors,
      );
      return;
    }

    if (error instanceof QueryFailedError) {
      console.error(
        `Erro de consulta do TypeORM em ${req.method} ${req.url}:`,
        error,
      );
      sendErrorResponse(
        res,
        500,
        'Database Error',
        'Erro na consulta ao banco de dados.',
        error.message,
      );
      return;
    }

    if (error instanceof EntityNotFoundError) {
      console.error(
        `Entidade não encontrada (TypeORM) em ${req.method} ${req.url}:`,
        error,
      );
      sendErrorResponse(
        res,
        404,
        'Not Found',
        'Entidade não encontrada.',
        error.message,
      );
      return;
    }

    if (error instanceof ApiError) {
      console.error(
        `Unexpected error on ${req.method} resource:`,
        error.message,
      );
      sendErrorResponse(res, error.statusCode, 'API Error', error.message);
      return;
    }

    if (error instanceof Error) {
      console.error(
        `Unexpected error on ${req.method} resource:`,
        error.message,
      );
      sendErrorResponse(
        res,
        500,
        'Internal Server Error',
        'An unexpected error occurred.',
        error.message,
      );
      return;
    }

    console.error('An unknown error occurred:', error);
    sendErrorResponse(
      res,
      500,
      'Unknown Error',
      'An unexpected error occurred while processing the request.',
    );
  };

  public static validateBodyRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.method.toLocaleLowerCase() !== 'get') {
      if (!req.body || Object.keys(req.body).length === 0) {
        sendErrorResponse(
          res,
          400,
          'Bad Request',
          'Invalid requisition. Empty body.',
        );
        return;
      }
    }
    next();
  };

  public static authentication = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        throw new Error('Token não fornecido');
      }

      const decoded = jwt.verify(token, SECRET_KEY) as AuthPayloadInterface;
      (req as unknown as CustomRequestInterface).token = decoded;

      next();
    } catch (err) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        sendErrorResponse(
          res,
          401,
          'Unauthorized',
          'Token expirado. Por favor, faça login novamente.',
        );
        return;
      }

      if (err instanceof Error && err.name === 'JsonWebTokenError') {
        sendErrorResponse(
          res,
          401,
          'Unauthorized',
          'Token inválido. Por favor, forneça um token válido.',
        );
        return;
      }

      if (err instanceof Error && err.name === 'NotBeforeError') {
        sendErrorResponse(
          res,
          401,
          'Unauthorized',
          'Token não está ativo ainda. Por favor, verifique o horário de ativação.',
        );
        return;
      }

      if (err instanceof Error) {
        sendErrorResponse(
          res,
          401,
          'Unauthorized',
          err.message || 'Falha na autenticação. Token inválido ou ausente.',
        );
        return;
      }
    }
  };
}

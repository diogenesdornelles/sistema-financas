import { Request, Response, NextFunction } from "express";

import { QueryFailedError, EntityNotFoundError } from "typeorm";
import jwt, { Secret } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { z } from "zod";

import { AuthPayloadInterface } from "../interfaces/auth-payload.interface";
import { CustomRequestInterface } from "../interfaces/custom-request.interface";
import { ApiError } from "../utils/api-error.util";
import GeneralValidator from "../../../packages/validators/general.validator";


// Load environment variables from .env file
dotenv.config();

// Set the secret key for JWT; fallback provided if not set in the environment
const SECRET_KEY: Secret =
  process.env.SECRET_KEY || "r34534erfefgdf7576ghfg4455456";

/**
 * GeneralMiddleware contains various middleware functions for validation,
 * error handling, authentication, and authorization.
 */
export default class GeneralMiddleware {
  /**
   * Middleware to validate CPF format in the request parameters.
   *
   * Extracts the 'cpf' parameter and uses GeneralValidator to verify its format.
   * If the CPF is valid, it calls next(); otherwise, it sends a 400 response.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   */
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
    res.status(400).json({
      error: "Invalid CPF format. Please provide a valid CPF.",
    });
    return;
  };

  /**
   * Middleware to validate UUID format in the request parameters.
   *
   * Extracts the 'cod' parameter and uses GeneralValidator to verify its UUID format.
   * If the UUID is valid, it calls next(); otherwise, it sends a 400 response.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   */
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
    res.status(400).json({
      error: "Invalid UUID format. Please provide a valid UUID.",
    });
    return;
  };

  /**
   * Global error handling middleware.
   *
   * This function logs errors and sends appropriate responses based on error type.
   * It handles Zod validation errors, Prisma errors, custom API errors, and generic errors.
   *
   * @param {any} error - The error thrown.
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   */
  public static errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    console.error("Error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      console.error(
        `Validation error on ${req.method} resource:`,
        error.errors,
      );
      res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
      return;
    }

    // Tratamento de erros do TypeORM - erros de consulta
    if (error instanceof QueryFailedError) {
      console.error(
        `Erro de consulta do TypeORM em ${req.method} ${req.url}:`,
        error,
      );
      res.status(500).json({
        error: "Erro na consulta ao banco de dados",
        details: error.message,
      });
      return;
    }

    // Tratamento de erros do TypeORM - entidade não encontrada
    if (error instanceof EntityNotFoundError) {
      console.error(
        `Entidade não encontrada (TypeORM) em ${req.method} ${req.url}:`,
        error,
      );
      res.status(404).json({
        error: "Entidade não encontrada",
        details: error.message,
      });
      return;
    }

    // Handle custom API errors
    if (error instanceof ApiError) {
      console.error(
        `Unexpected error on ${req.method} resource:`,
        error.message,
      );
      res.status(error.statusCode).json({
        error: error.message,
        details: error.message,
      });
      return;
    }

    // Handle generic errors
    if (error instanceof Error) {
      console.error(
        `Unexpected error on ${req.method} resource:`,
        error.message,
      );
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
      return;
    }

    // If none of the above error types match, return a generic error response
    console.error("An unknown error occurred:", error);
    res.status(500).json({
      error: "Unknown error",
      details: "An unexpected error occurred while processing the request.",
    });
    return;
  };

  /**
   * Middleware to validate that the request body is not empty for non-GET requests.
   *
   * If the request method is not GET and the body is empty, it sends a 400 response.
   * Otherwise, it passes control to the next middleware.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   */
  public static validateBodyRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.method.toLocaleLowerCase() !== "get") {
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "Invalid requisition" });
        return;
      }
    }
    next();
    return;
  };

  /**
   * Authentication middleware to verify the JWT token in the request header.
   *
   * Extracts the token from the 'Authorization' header, verifies it using the SECRET_KEY,
   * and attaches the decoded token payload to the request. If verification fails, it sends
   * a 401 response.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   */
  public static authentication = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      // Extract the token from the Authorization header (removing the 'Bearer ' prefix)
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new Error();
      }

      // Verify the token and cast the payload to AuthPayloadInterface
      const decoded = jwt.verify(token, SECRET_KEY) as AuthPayloadInterface;
      (req as unknown as CustomRequestInterface).token = decoded;

      next();
    } catch (err) {
      res.status(401).send("Please authenticate");
      return;
    }
  };
}

import { Request, Response, NextFunction } from "express";
import { BaseService } from "../service/base.service";
import { Base } from "../entity/entities";

/**
 * Abstract base controller class.
 *
 * This class provides the foundational structure for controllers in the application.
 * It expects a service instance to handle business logic and a DTO validator for validating
 * data transfer objects. Subclasses must implement the abstract methods to handle
 * CRUD operations.
 *
 * @template T - The type of the service, which must extend BaseService with generic types.
 */
export abstract class BaseController<
  T extends BaseService<
    Base,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >,
> {
  // The service instance used for business logic operations.
  public service: T;

  /**
   * Creates an instance of BaseController.
   *
   * @param {T} service - The service instance responsible for business logic.
   */
  constructor(service: T) {
    this.service = service;
  }

  /**
   * Retrieves all records.
   *
   * Subclasses must implement this method to handle retrieving all records.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public abstract getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  /**
   * Retrieves 10 records, with skip.
   *
   * Subclasses must implement this method to handle retrieving all records.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public abstract getMany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  /**
   * Retrieves a single record.
   *
   * Subclasses must implement this method to handle retrieving a single record.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public abstract getOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  /**
   * Creates a new record.
   *
   * Subclasses must implement this method to handle the creation of a new record.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public abstract create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  /**
   * Updates an existing record.
   *
   * Subclasses must implement this method to handle updating a record.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public abstract update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  /**
   * Deletes a record.
   *
   * Subclasses must implement this method to handle the deletion of a record.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public abstract delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  /**
   * Query records.
   *
   * Subclasses must implement this method to handle the query.
   *
   * @param {Request} req - The Express Request object.
   * @param {Response} res - The Express Response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public abstract query(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

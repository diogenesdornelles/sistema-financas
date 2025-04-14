import { Router } from "express";

/**
 * Abstract base class for defining API routes.
 *
 * This class provides a foundation for creating routers that are associated with a specific controller.
 * It sets up an Express Router instance and requires subclasses to implement the route initialization.
 *
 * @template T - The type of the controller associated with this router.
 */
export abstract class BaseRouter<T> {
  // Express Router instance used for defining routes.
  public router: Router;
  // Controller instance associated with this router.
  public controller: T;

  /**
   * Creates an instance of BaseRouter.
   *
   * @param {T} controller - The controller instance to be associated with this router.
   *
   * The constructor initializes the router, assigns the controller, and calls the abstract method
   * initRoutes() to set up the routes. Each subclass must provide its own implementation of initRoutes().
   */
  constructor(controller: T) {
    // Initialize the Express Router.
    this.router = Router();
    // Assign the controller.
    this.controller = controller;
    // Initialize the routes defined by the subclass.
    this.initRoutes();
  }

  /**
   * Abstract method for initializing routes.
   *
   * Each subclass must implement this method to define its routes and attach the appropriate
   * controller methods to the Express router.
   */
  protected abstract initRoutes(): void;
}

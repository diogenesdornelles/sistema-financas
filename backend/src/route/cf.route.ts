import CfController from '../controller/cf.controller.js';
import GeneralMiddleware from '../middleware/GeneralMiddleware.js';
import { BaseRouter } from './base.route.js';

export default class CfRouter extends BaseRouter<CfController> {
  /**
   * Creates an instance of CfRouter.
   * @memberof CfRouter
   */
  constructor() {
    super(new CfController());
  }
  /**
   * Inicializa as rotas do router
   *
   * @protected
   * @memberof CatRouter
   */
  protected initRoutes(): void {
    this.router.get(
      '/',
      GeneralMiddleware.authentication,
      this.controller.getAll,
      GeneralMiddleware.errorHandler,
    );

    this.router.get(
      '/many/:skip',
      GeneralMiddleware.authentication,
      this.controller.getMany,
      GeneralMiddleware.errorHandler,
    );

    this.router.get(
      '/:id',
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateUUID,
      this.controller.getOne,
      GeneralMiddleware.errorHandler,
    );

    this.router.post(
      '/',
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateBodyRequest,
      this.controller.create,
      GeneralMiddleware.errorHandler,
    );

    this.router.put(
      '/:id',
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateUUID,
      GeneralMiddleware.validateBodyRequest,
      this.controller.update,
      GeneralMiddleware.errorHandler,
    );

    this.router.delete(
      '/:id',
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateUUID,
      this.controller.delete,
      GeneralMiddleware.errorHandler,
    );
    this.router.post(
      '/query',
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateBodyRequest,
      this.controller.query,
      GeneralMiddleware.errorHandler,
    );
  }
}

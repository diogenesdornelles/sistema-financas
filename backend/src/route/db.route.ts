import GeneralMiddleware from "../middleware/GeneralMiddleware";
import DbController from "../controller/db.controller";
import { BaseRouter } from "./base.route";

export default class DbRouter extends BaseRouter<DbController> {
  /**
   * Creates an instance of DbRouter.
   * @memberof DbRouter
   */
  constructor() {
    super(new DbController());
  }
  /**
   * Inicializa as rotas do router
   *
   * @protected
   * @memberof CatRouter
   */
  protected initRoutes(): void {
    this.router.get(
      "/balances/:date",
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateDateUntilPresent,
      this.controller.getBalances,
      GeneralMiddleware.errorHandler,
    );
    this.router.get(
      "/cpscrs/:date",
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateDatePostPresent,
      this.controller.getCpsCrs,
      GeneralMiddleware.errorHandler,
    );
  }
}

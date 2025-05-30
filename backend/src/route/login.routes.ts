import LoginController from "../controller/login.controller.js";
import GeneralMiddleware from "../middleware/GeneralMiddleware.js";
import { BaseRouter } from "./base.route.js";

export default class LoginRouter extends BaseRouter<LoginController> {
  /**
   * Creates an instance of LoginRouter.
   * @memberof LoginRouter
   */
  constructor() {
    super(new LoginController());
  }
  /**
   * Inicializa as rotas do router
   *
   * @protected
   * @memberof CatRouter
   */
  protected initRoutes(): void {
    this.router.post(
      "/",
      GeneralMiddleware.validateBodyRequest,
      this.controller.create,
      GeneralMiddleware.errorHandler,
    );
  }
}

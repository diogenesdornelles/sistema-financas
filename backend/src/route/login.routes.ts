import LoginController from "../controller/login.controller";
import GeneralMiddleware from "../middleware/general.middleware";
import { BaseRouter } from "./base.route";

export default class LoginRouter extends BaseRouter<LoginController> {
  constructor() {
    super(new LoginController());
  }

  protected initRoutes(): void {
    this.router.post(
      "/",
      GeneralMiddleware.validateBodyRequest,
      this.controller.create,
      GeneralMiddleware.errorHandler,
    );
  }
}

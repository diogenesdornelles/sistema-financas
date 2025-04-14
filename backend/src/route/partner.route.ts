import PartnerController from "../controller/partner.controller";
import GeneralMiddleware from "../middleware/general.middleware";
import { BaseRouter } from "./base.route";

export default class PartnerRouter extends BaseRouter<PartnerController> {
  constructor() {
    super(new PartnerController());
  }

  protected initRoutes(): void {
    this.router.get(
      "/",
      GeneralMiddleware.authentication,
      this.controller.getAll,
      GeneralMiddleware.errorHandler,
    );

    this.router.get(
      "/many/:skip",
      GeneralMiddleware.authentication,
      this.controller.getMany,
      GeneralMiddleware.errorHandler,
    );

    this.router.get(
      "/:id",
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateUUID,
      this.controller.getOne,
      GeneralMiddleware.errorHandler,
    );

    this.router.post(
      "/",
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateBodyRequest,
      this.controller.create,
      GeneralMiddleware.errorHandler,
    );

    this.router.put(
      "/:id",
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateUUID,
      GeneralMiddleware.validateBodyRequest,
      this.controller.update,
      GeneralMiddleware.errorHandler,
    );

    this.router.delete(
      "/:id",
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateUUID,
      this.controller.delete,
      GeneralMiddleware.errorHandler,
    );
    this.router.post(
      "/query",
      GeneralMiddleware.authentication,
      GeneralMiddleware.validateBodyRequest,
      this.controller.query,
      GeneralMiddleware.errorHandler,
    );
  }
}

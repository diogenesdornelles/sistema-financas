import { BaseController } from "../controller/base.controller";
import { BaseRouter } from "../route/base.route";
import { BaseService } from "../service/base.service";
import { Base } from "../entity/entities";

// Generic type for a base router that is associated with a controller and service.
export type BaseRouterType = BaseRouter<
  BaseController<
    BaseService<
      Base,
      Record<string, any>,
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >
  >
>;

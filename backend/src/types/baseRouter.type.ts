import { BaseController } from '../controller/base.controller.js';
import { Base } from '../entity/entities.js';
import { BaseRouter } from '../route/base.route.js';
import { BaseService } from '../service/base.service.js';

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

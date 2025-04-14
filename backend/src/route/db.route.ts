import GeneralMiddleware from "../middleware/general.middleware";
import DbController from "../controller/db.controller";
import { BaseRouter } from "./base.route";

export default class DbRouter extends BaseRouter<DbController> {
    constructor() {
        super(new DbController)
    }

    protected initRoutes(): void {
        this.router.get(
            "/balances/:date",
            GeneralMiddleware.authentication,
            GeneralMiddleware.validateDateUntilPresent,
            this.controller.getBalances,
            GeneralMiddleware.errorHandler,
        );
    }
}

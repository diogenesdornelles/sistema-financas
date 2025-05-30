import CatRouter from "./route/cat.route.js";
import CfRouter from "./route/cf.route.js";
import CpRouter from "./route/cp.route.js";
import CrRouter from "./route/cr.route.js";
import DbRouter from "./route/db.route.js";
import LoginRouter from "./route/login.routes.js";
import PartnerRouter from "./route/partner.route.js";
import TcfRouter from "./route/tcf.route.js";
import TcpRouter from "./route/tcp.route.js";
import TcrRouter from "./route/tcr.route.js";
import TxRouter from "./route/tx.route.js";
import UserRouter from "./route/user.route.js";
import { BaseRouterType } from "./types/baseRouter.type.js";
import { RouteConfigType } from "./types/routeConfig.type.js";

// Registra routers e suas respectivas rotas raízes
const appRoutes: RouteConfigType[] = [
  {
    baseRouter: new UserRouter(),
    basePath: "/user",
  },
  {
    baseRouter: new LoginRouter(),
    basePath: "/login",
  },
  {
    baseRouter: new CfRouter(),
    basePath: "/cf",
  },
  {
    baseRouter: new TcfRouter(),
    basePath: "/tcf",
  },
  {
    baseRouter: new CpRouter(),
    basePath: "/cp",
  },
  {
    baseRouter: new TcpRouter(),
    basePath: "/tcp",
  },
  {
    baseRouter: new CrRouter(),
    basePath: "/cr",
  },
  {
    baseRouter: new TcrRouter(),
    basePath: "/tcr",
  },
  {
    baseRouter: new CrRouter(),
    basePath: "/cr",
  },
  {
    baseRouter: new PartnerRouter(),
    basePath: "/partner",
  },
  {
    baseRouter: new TxRouter(),
    basePath: "/tx",
  },
  {
    baseRouter: new CatRouter(),
    basePath: "/cat",
  },
  {
    baseRouter: new DbRouter() as unknown as BaseRouterType,
    basePath: "/db",
  },
];

export default appRoutes;

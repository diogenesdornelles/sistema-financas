import CatRouter from "./route/cat.route";
import CfRouter from "./route/cf.route";
import CpRouter from "./route/cp.route";
import CrRouter from "./route/cr.route";
import DbRouter from "./route/db.route";
import LoginRouter from "./route/login.routes";
import PartnerRouter from "./route/partner.route";
import TcfRouter from "./route/tcf.route";
import TcpRouter from "./route/tcp.route";
import TcrRouter from "./route/tcr.route";
import TxRouter from "./route/tx.route";
import UserRouter from "./route/user.route";
import { BaseRouterType } from "./types/base-router.type";
import { RouteConfigType } from "./types/route-config.type";

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

import LoginRouter from "./route/login.routes";
import UserRouter from "./route/user.route";
import { RouteConfigType } from "./types/route-config.type";

// Registers routes and paths
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
];

export default appRoutes;

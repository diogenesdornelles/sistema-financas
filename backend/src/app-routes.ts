import LoginRouter from "./route/login.routes";
import UserRouter from "./route/user.route";
import { RouteConfigType } from "./types/route-config.type";

// Registers routes and paths
const appRoutes: RouteConfigType[] = [
  {
    baseRouter: new UserRouter(),
    basePath: "/users",
  },
  {
    baseRouter: new LoginRouter(),
    basePath: "/login",
  },
];

export default appRoutes;

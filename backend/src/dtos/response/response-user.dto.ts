import { User } from "../../entity/entities";

export interface ResponseUserDTO extends Omit<User, "pwd"> {}

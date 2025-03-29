import { User } from "../../entity/user";

export interface ResponseUserDTO extends Omit<User, "senha"> {}

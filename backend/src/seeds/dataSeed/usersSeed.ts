import { RoleType } from "../../../../packages/dtos/utils/enums";

export const usersSeed = [
  {
    name: "Mario",
    surname: "Gomes",
    cpf: "30834005000",
    pwd: "@123ABCabc",
    role: RoleType.ANALIST,
  },
  {
    name: "Fernando",
    surname: "Silva",
    cpf: "20845361031",
    pwd: "@123ABCabc",
    role: RoleType.ASSISTANT,
  },
  {
    name: "Eduardo",
    surname: "Dias",
    cpf: "56970005020",
    pwd: "@123ABCabc",
    role: RoleType.MANAGER,
  },
];

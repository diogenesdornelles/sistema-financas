import { Entity, Column } from "typeorm";
import { Base } from "./base";

@Entity({ name: "users" })
export class User extends Base {
  @Column({ length: 11, unique: true })
  cpf!: string;

  @Column({ length: 128 })
  senha!: string;

  @Column({ length: 30 })
  nome!: string;

  @Column({ length: 60 })
  sobrenome!: string;

  @Column({ default: true })
  status!: boolean;
}

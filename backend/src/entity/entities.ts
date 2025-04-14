import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import {
  CPStatus,
  PartnerType,
  PaymentStatus,
  TransactionType,
} from "../../../packages/dtos/utils/enums";

// Classe base com id, createdAt e updatedAt
@Entity()
export abstract class Base {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // Create: no required; Update: no required; Response: required

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date; // Create: no required; Update: no required; Response: required

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date; // Create: no required; Update: no required; Response: required
}

// 1. Usuário
@Entity("user")
export class User extends Base {
  @Column({ type: "varchar", length: 30 })
  name!: string; // Create: required; Update: optional; Response: required

  @Column({ type: "varchar", length: 60 })
  surname!: string; // Create: required; Update: optional; Response: required

  @Column({ type: "varchar", length: 11, unique: true })
  cpf!: string; // Create: required; Update: optional; Response: required

  @Column({ type: "varchar", length: 128 })
  pwd!: string; // Create: required; Update: optional; Response: no required

  @Column({ type: "boolean", default: true })
  status!: boolean; // Create: no required; Update: optional; Response: required

  @OneToMany(() => Cf, (cf) => cf.user)
  cfs!: Cf[]; // Create: no required; Update: no required; Response: no required

  @OneToMany(() => Cp, (cp) => cp.user)
  cps!: Cp[]; // Create: no required; Update: no required; Response: no required

  @OneToMany(() => Cr, (cr) => cr.user)
  crs!: Cr[]; // Create: no required; Update: no required; Response: no required

  @OneToMany(() => Tx, (tx) => tx.user)
  txs!: Tx[]; // Create: no required; Update: no required; Response: no required

  @OneToMany(() => Partner, (partner) => partner.user)
  partners!: Partner[]; // Create: no required; Update: no required; Response: no required

  @OneToMany(() => Cat, (cat) => cat.user)
  cats!: Cat[]; // Create: no required; Update: no required; Response: no required
}

// 2. Cf (Conta Financeira)
@Entity("cf")
export class Cf extends Base {
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0.0 })
  balance!: number; // Create: no required; Update: no required; Response: required

  @ManyToOne(() => Tcf, (tcf) => tcf.cfs)
  @JoinColumn({ name: "tcfId" })
  type!: Tcf; // Create: required; Update: no required; Response: required as Tcf

  @ManyToOne(() => User, (user) => user.cfs)
  @JoinColumn({ name: "userId" })
  user!: User; // Create: required; Update: no required; Response: no required

  @Column({ type: "varchar", length: 10 }) // se for cartão, não precisa outros campos
  number!: string; // Create: required; Update: no required; Response: required

  @Column({ type: "varchar", length: 10, nullable: true })
  ag!: string; // Create: no required; Update: no required; Response: required

  @Column({ type: "varchar", length: 30, nullable: true })
  bank!: string; // Create: no required; Update: no required; Response: required

  @Column({ type: "text", nullable: true })
  obs!: string; // Create: no required; Update: no required; Response: required

  @Column({ type: "boolean", default: true })
  status!: boolean; // Create: no required; Update: no required; Response: required

  @OneToMany(() => Tx, (tx) => tx.cf)
  txs!: Tx[]; // Create: no required; Update: no required; Response: no required
}

// 3. Tcf (Tipo Conta Financeira)
@Entity("tcf")
export class Tcf extends Base {
  @Column({ type: "varchar", length: 40, unique: true })
  name!: string; // Create: required; Update: no required; Response: required

  @Column({ type: "boolean", default: true })
  status!: boolean; // Create: no required; Update: no required; Response: required

  @OneToMany(() => Cf, (cf) => cf.type)
  cfs!: Cf[]; // Create: no required; Update: no required; Response: no required
}

// 4. Cp (Conta a Pagar)
@Entity("cp")
export class Cp extends Base {
  @Column({ type: "decimal", precision: 15, scale: 2 })
  value!: number; // Create: required; Update: no required; Response: required

  @ManyToOne(() => Tcp, (tcp) => tcp.cps)
  @JoinColumn({ name: "tcpId" })
  type!: Tcp; // Create: required; Update: no required; Response: required as Tcp

  @ManyToOne(() => Partner, (partner) => partner.cps)
  @JoinColumn({ name: "supplierId" })
  supplier!: Partner; // Create: required; Update: no required; Response: required as Partner

  @Column({ type: "date" })
  due!: Date; // Create: required; Update: no required; Response: required

  @Column({ type: "text", nullable: true })
  obs!: string; // Create: no required; Update: no required; Response: required

  @ManyToOne(() => User, (user) => user.cps)
  @JoinColumn({ name: "userId" })
  user!: User; // Create: required; Update: no required; Response: no required

  @Column({ type: "enum", enum: CPStatus, default: CPStatus.PENDING })
  status!: CPStatus; // Create: no required; Update: no required; Response: required

  @OneToMany(() => Tx, (tx) => tx.cp)
  txs!: Tx[]; // Create: no required; Update: no required; Response: no required
}

// 5. Tcp (Tipo Conta a Pagar)
@Entity("tcp")
export class Tcp extends Base {
  @Column({ type: "varchar", length: 40, unique: true })
  name!: string; // Create: required; Update: no required; Response: required

  @Column({ type: "boolean", default: true })
  status!: boolean; // Create: no required; Update: no required; Response: required

  @OneToMany(() => Cp, (cp) => cp.type)
  cps!: Cp[]; // Create: no required; Update: no required; Response: no required
}

// 6. Cr (Conta a Receber)
@Entity("cr")
export class Cr extends Base {
  @Column({ type: "decimal", precision: 15, scale: 2 })
  value!: number; // Create: required; Update: no required; Response: required

  @ManyToOne(() => Tcr, (tcr) => tcr.crs)
  @JoinColumn({ name: "tcrId" })
  type!: Tcr; // Create: required; Update: no required; Response: required as Tcr

  @ManyToOne(() => Partner, (partner) => partner.crs)
  @JoinColumn({ name: "customerId" })
  customer!: Partner; // Create: required; Update: no required; Response: required as Partner

  @Column({ type: "date" })
  due!: Date; // Create: required; Update: no required; Response: required

  @Column({ type: "text", nullable: true })
  obs!: string; // Create: no required; Update: no required; Response: required

  @ManyToOne(() => User, (user) => user.crs)
  @JoinColumn({ name: "userId" })
  user!: User; // Create: required; Update: no required; Response: no required

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus; // Create: no required; Update: no required; Response: required

  @OneToMany(() => Tx, (tx) => tx.cr)
  txs!: Tx[]; // Create: no required; Update: no required; Response: no required
}

// 7. Tcr (Tipo Conta a Receber)
@Entity("tcr")
export class Tcr extends Base {
  @Column({ type: "varchar", length: 40, unique: true })
  name!: string; // Create: required; Update: no required; Response: required

  @Column({ type: "boolean", default: true })
  status!: boolean; // Create: no required; Update: no required; Response: required

  @OneToMany(() => Cr, (cr) => cr.type)
  crs!: Cr[]; // Create: no required; Update: no required; Response: no required
}

// 8. Partner
@Entity("partner")
export class Partner extends Base {
  @Column({ type: "varchar", length: 100 })
  name!: string; // Create: required; Update: no required; Response: required

  @Column({ type: "enum", enum: PartnerType })
  type!: PartnerType; // Create: required; Update: no required; Response: required

  @Column({ type: "varchar", length: 20, unique: true })
  cod!: string; // Create: required; Update: no required; Response: required

  @ManyToOne(() => User, (user) => user.partners)
  @JoinColumn({ name: "userId" })
  user!: User; // Create: required; Update: no required; Response: no required

  @Column({ type: "boolean", default: true })
  status!: boolean; // Create: no required; Update: no required; Response: required

  @Column({ type: "text", nullable: true })
  obs!: string; // Create: no required; Update: no required; Response: required

  @OneToMany(() => Cp, (cp) => cp.supplier)
  cps!: Cp[]; // Create: no required; Update: no required; Response: no required

  @OneToMany(() => Cr, (cr) => cr.customer)
  crs!: Cr[]; // Create: no required; Update: no required; Response: no required
}

// 9. Tx (Transação)
@Entity("tx")
export class Tx extends Base {
  @Column({ type: "decimal", precision: 15, scale: 2 })
  value!: number; // Create: required; Update: no required; Response: required

  @Column({ type: "enum", enum: TransactionType })
  type!: TransactionType; // Create: required; Update: no required; Response: required

  @ManyToOne(() => Cf, (cf) => cf.txs)
  @JoinColumn({ name: "cfId" })
  cf!: Cf; // Create: required; Update: no required; Response: required as Cf

  @Column({ type: "varchar", length: 100 })
  description!: string; // Create: required; Update: no required; Response: required

  @ManyToOne(() => Cp, (cp) => cp.txs, { nullable: true })
  @JoinColumn({ name: "cpId" })
  cp!: Cp; // Create: required; Update: no required; Response: no required

  @ManyToOne(() => Cr, (cr) => cr.txs, { nullable: true })
  @JoinColumn({ name: "crId" })
  cr!: Cr; // Create: required; Update: no required; Response: no required

  @ManyToOne(() => User, (user) => user.txs)
  @JoinColumn({ name: "userId" })
  user!: User; // Create: required; Update: no required; Response: no required

  @Column({ type: "date" })
  tdate!: Date; // Create: no required; Update: no required; Response: no required

  @ManyToOne(() => Cat, (cat) => cat.txs)
  @JoinColumn({ name: "catId" })
  category!: Cat; // Create: required; Update: no required; Response: required as Cat

  @Column({ type: "text", nullable: true })
  obs!: string; // Create: no required; Update: no required; Response: required

  @Column({ type: "boolean", default: true })
  status!: boolean; // Create: no required; Update: no required; Response: required
}

// 10. Cat (Categoria)
@Entity("cat")
export class Cat extends Base {
  @Column({ type: "varchar", length: 100, unique: true })
  name!: string; // Create: required; Update: no required; Response: required

  @Column({ type: "text", nullable: true })
  description!: string; // Create: required; Update: no required; Response: required

  @ManyToOne(() => User, (user) => user.cats)
  @JoinColumn({ name: "userId" })
  user!: User; // Create: required; Update: no required; Response: no required

  @Column({ type: "boolean", default: true })
  status!: boolean; // Create: no required; Update: no required; Response: required

  @Column({ type: "text", nullable: true })
  obs!: string; // Create: no required; Update: no required; Response: required

  @OneToMany(() => Tx, (tx) => tx.category)
  txs!: Tx[]; // Create: no required; Update: no required; Response: no required
}

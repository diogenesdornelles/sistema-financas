import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

// Classe base com id, createdAt e updatedAt
@Entity()
export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}

// Enums para status, tipos e transações
export enum CPStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum PartnerType {
  PF = 'PF',
  PJ = 'PJ',
}

export enum TransactionType {
  ENTRY = 'E',
  OUTFLOW = 'O',
}

// 1. Usuário
@Entity('user')
export class User extends Base {
  @Column({ type: 'varchar', length: 30 })
  name!: string;

  @Column({ type: 'varchar', length: 60 })
  surname!: string;

  @Column({ type: 'varchar', length: 11 })
  cpf!: string;

  @Column({ type: 'varchar', length: 128 })
  pwd!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @OneToMany(() => Cf, (cf) => cf.user)
  cfs!: Cf[];

  @OneToMany(() => Cp, (cp) => cp.user)
  cps!: Cp[];

  @OneToMany(() => Cr, (cr) => cr.user)
  crs!: Cr[];

  @OneToMany(() => Tx, (tx) => tx.user)
  txs!: Tx[];

  @OneToMany(() => Partner, (partner) => partner.user)
  partners!: Partner[];

  @OneToMany(() => Cat, (cat) => cat.user)
  cats!: Cat[];
}

// 2. Cf (Conta Financeira)
@Entity('cf')
export class Cf extends Base {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance!: number;

  @ManyToOne(() => Tcf, (tcf) => tcf.cfs)
  @JoinColumn({ name: 'tcfId' })
  type!: Tcf;

  @ManyToOne(() => User, (user) => user.cfs)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'text', nullable: true })
  obs!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @OneToMany(() => Tx, (tx) => tx.cf)
  txs!: Tx[];
}

// 3. Tcf (Tipo Conta Financeira)
@Entity('tcf')
export class Tcf extends Base {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @OneToMany(() => Cf, (cf) => cf.type)
  cfs!: Cf[];
}

// 4. Cp (Conta a Pagar)
@Entity('cp')
export class Cp extends Base {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @ManyToOne(() => Tcp, (tcp) => tcp.cps)
  @JoinColumn({ name: 'tcpId' })
  type!: Tcp;

  @ManyToOne(() => Partner, (partner) => partner.cps)
  @JoinColumn({ name: 'supplierId' })
  supplier!: Partner;

  @Column({ type: 'date' })
  due!: Date;

  @Column({ type: 'text', nullable: true })
  obs!: string;

  @ManyToOne(() => User, (user) => user.cps)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'enum', enum: CPStatus })
  status!: CPStatus;
}

// 5. Tcp (Tipo Conta a Pagar)
@Entity('tcp')
export class Tcp extends Base {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @OneToMany(() => Cp, (cp) => cp.type)
  cps!: Cp[];
}

// 6. Cr (Conta a Receber)
@Entity('cr')
export class Cr extends Base {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @ManyToOne(() => Tcr, (tcr) => tcr.crs)
  @JoinColumn({ name: 'tcrId' })
  type!: Tcr;

  @ManyToOne(() => Partner, (partner) => partner.crs)
  @JoinColumn({ name: 'customerId' })
  customer!: Partner;

  @Column({ type: 'date' })
  due!: Date;

  @Column({ type: 'text', nullable: true })
  obs!: string;

  @ManyToOne(() => User, (user) => user.crs)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'enum', enum: PaymentStatus })
  status!: PaymentStatus;
}

// 7. Tcr (Tipo Conta a Receber)
@Entity('tcr')
export class Tcr extends Base {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @OneToMany(() => Cr, (cr) => cr.type)
  crs!: Cr[];
}

// 8. Partner
@Entity('partner')
export class Partner extends Base {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'enum', enum: PartnerType })
  type!: PartnerType;

  @Column({ type: 'varchar', length: 20 })
  cod!: string;

  @ManyToOne(() => User, (user) => user.partners)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'text', nullable: true })
  obs!: string;

  @OneToMany(() => Cp, (cp) => cp.supplier)
  cps!: Cp[];

  @OneToMany(() => Cr, (cr) => cr.customer)
  crs!: Cr[];
}

// 9. Tx (Transação)
@Entity('tx')
export class Tx extends Base {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @ManyToOne(() => Cf, (cf) => cf.txs)
  @JoinColumn({ name: 'cfId' })
  cf!: Cf;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => User, (user) => user.txs)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Cat, (cat) => cat.txs)
  @JoinColumn({ name: 'catId' })
  category!: Cat;

  @Column({ type: 'text', nullable: true })
  obs!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;
}

// 10. Cat (Categoria)
@Entity('cat')
export class Cat extends Base {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => User, (user) => user.cats)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'text', nullable: true })
  obs!: string;

  @OneToMany(() => Tx, (tx) => tx.category)
  txs!: Tx[];
}

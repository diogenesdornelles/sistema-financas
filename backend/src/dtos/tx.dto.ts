import { TransactionType } from "../entity/entities";
import { CfResponseDto } from "./cf.dto";
import { CatResponseDto } from "./cat.dto";

export class CreateTxDto {
  value!: number;
  type!: TransactionType;
  cf!: string; // Identificador de Cf
  description?: string;
  user!: string;
  category!: string; // Identificador de Cat
  obs?: string;
}

export class UpdateTxDto {
  value?: number;
  type?: TransactionType;
  cf?: string;
  description?: string;
  user?: string;
  category?: string;
  obs?: string;
  status?: boolean;
}

export class TxResponseDto {
  id!: string;
  value!: number;
  type!: TransactionType;
  cf!: CfResponseDto;
  description!: string;
  category!: CatResponseDto;
  obs!: string;
  status!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

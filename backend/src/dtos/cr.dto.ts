import { PaymentStatus } from "../entity/entities";
import { PartnerResponseDto } from "./partner.dto";
import { TcrResponseDto } from "./tcr.dto";

export class CreateCrDto {
  value!: number;
  type!: string; // Identificador de Tcr
  customer!: string; // Identificador de Partner
  due!: Date;
  obs?: string;
  user!: string;
}

export class UpdateCrDto {
  value?: number;
  type?: string;
  customer?: string;
  due?: Date;
  obs?: string;
  user?: string;
  status?: PaymentStatus;
}

export class CrResponseDto {
  id!: string;
  value!: number;
  type!: TcrResponseDto;
  customer!: PartnerResponseDto;
  due!: Date;
  obs!: string;
  status!: PaymentStatus;
  createdAt!: Date;
  updatedAt!: Date;
}


import { CPStatus } from "../entity/entities";
import { PartnerResponseDto } from "./partner.dto";
import { TcpResponseDto } from "./tcp.dto";

export class CreateCpDto {
  // required na criação
  value!: number;
  type!: string; // Identificador de Tcp
  supplier!: string; // Identificador de Partner
  due!: Date;
  obs?: string;
  user?: string;
}

export class UpdateCpDto {
  value?: number;
  type?: string;
  supplier?: string;
  due?: Date;
  obs?: string;
  user?: string;
  status?: CPStatus;
}

export class CpResponseDto {
  id!: string;
  value!: number;
  type!: TcpResponseDto;
  supplier!: PartnerResponseDto;
  due!: Date;
  obs!: string;
  status!: CPStatus;
  createdAt!: Date;
  updatedAt!: Date;
}

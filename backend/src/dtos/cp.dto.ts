import { CPStatus } from "../entity/entities";
import { PartnerResponseDto } from "./supplier.dto";
import { TcpResponseDto } from "./tcp.dto";

export class CreateCpDto {
  // required na criação
  value!: number;
  type!: string; // Identificador de Tcp
  supplier!: string; // Identificador de Partner
  due!: Date;
  // Opcional: obs (default ''), user e status (default CPStatus.PENDING)
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
  // Retorna o objeto Tcp (ou pode ser somente o id, conforme sua estratégia)
  type!: TcpResponseDto;
  // Retorna o objeto Partner
  supplier!: PartnerResponseDto;
  due!: Date;
  obs!: string;
  // O campo user pode ser omitido na resposta se não for exposto
  user?: string;
  status!: CPStatus;
  createdAt!: Date;
  updatedAt!: Date;
}

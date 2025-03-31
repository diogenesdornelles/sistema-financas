import { TcfResponseDto } from "./tcf.dto";

export class CreateCfDto {
  // required na criação
  number!: string;
  type!: string; // Identificador de Tcf
  user!: string; // Identificador de User
  // Opcional: balance (default 0.0), ag, bank, obs e status (default true)
  balance?: number;
  ag?: string;
  bank?: string;
  obs?: string;
}

export class UpdateCfDto {
  // Todos opcionais na atualização
  number?: string;
  type?: string;
  user?: string;
  balance?: number;
  ag?: string;
  bank?: string;
  obs?: string;
  status?: boolean;
}

export class CfResponseDto {
  id!: string;
  number!: string;
  balance!: number;
  // Aqui podemos retornar o objeto Tcf ou somente seu id; neste exemplo, usamos o DTO de resposta
  type!: TcfResponseDto;
  // ag e bank podem ser nulos, mas na resposta serão retornados (podem ser string ou null)
  ag!: string | null;
  bank!: string | null;
  obs!: string;
  status!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

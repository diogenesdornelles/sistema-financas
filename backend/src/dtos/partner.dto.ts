import { PartnerType } from "../entity/entities";

// Enum para o tipo de Parceiro
export class CreatePartnerDto {
  name!: string;
  type!: PartnerType;
  cod!: string;
  user!: string;
  obs?: string;
}

export class UpdatePartnerDto {
  name?: string;
  type?: PartnerType;
  cod?: string;
  user?: string;
  obs?: string;
  status?: boolean;
}

export class PartnerResponseDto {
  id!: string;
  name!: string;
  type!: PartnerType;
  cod!: string;
  status!: boolean;
  obs!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

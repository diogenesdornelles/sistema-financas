import { PartnerType } from "./utils/enums";


// Enum para o tipo de Parceiro
export interface CreatePartner {
  name: string;
  type: PartnerType;
  cod: string;
  user: string;
  obs?: string;
}

export interface UpdatePartner {
  name?: string;
  type?: PartnerType;
  cod?: string;
  user?: string;
  obs?: string;
  status?: boolean;
}

export interface PartnerProps {
  id: string;
  name: string;
  type: PartnerType;
  cod: string;
  status: boolean;
  obs: string;
  createdAt: Date;
  updatedAt: Date;
}

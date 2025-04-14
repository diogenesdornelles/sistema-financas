import { PartnerSearchType, PartnerType } from "./utils/enums";


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
  createdAt: string;
  updatedAt: string;
}


export interface QueryPartner {
  id?: string;
  name?: string;
  type?: PartnerSearchType;
  cod?: string;
  status?: boolean;
  obs?: string;
  createdAt?: string;
  updatedAt?: string;
}


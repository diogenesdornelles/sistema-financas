import { PartnerType } from "../../../../packages/dtos/utils/enums";
import { generateValidCNPJ } from "../utils/generateValidCNPJ";
import { generateValidCPF } from "../utils/generateValidCPF";


export const partnersSeed = [
  // Clientes Pessoa Física
  {
    name: "Maria Silva Santos",
    type: PartnerType.PF,
    cod: generateValidCPF(),
    obs: "Cliente VIP - Compras frequentes",
  },
  {
    name: "João Carlos Oliveira",
    type: PartnerType.PF,
    cod: generateValidCPF(),
    obs: "Cliente desde 2020",
  },
  {
    name: "Ana Paula Costa",
    type: PartnerType.PF,
    cod: generateValidCPF(),
    obs: "Cliente premium",
  },
  {
    name: "Roberto Lima",
    type: PartnerType.PF,
    cod: generateValidCPF(),
    obs: "Pagamento sempre em dia",
  },
  {
    name: "Fernanda Rodrigues",
    type: PartnerType.PF,
    cod: generateValidCPF(),
    obs: "Cliente corporativo",
  },

  // Clientes Pessoa Jurídica
  {
    name: "Tech Solutions Ltda",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Empresa de tecnologia - Contrato anual",
  },
  {
    name: "Comércio & Cia",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Loja de departamentos",
  },
  {
    name: "Indústria ABC S/A",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Cliente industrial - Grandes volumes",
  },
  {
    name: "Serviços Digitais ME",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Microempresa de serviços",
  },
  {
    name: "Consultoria Empresarial Ltda",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Prestação de serviços de consultoria",
  },

  // Fornecedores Pessoa Física
  {
    name: "Carlos Mendes Freelancer",
    type: PartnerType.PF,
    cod: generateValidCPF(),
    obs: "Designer freelancer",
  },
  {
    name: "Luiza Santos Consultora",
    type: PartnerType.PF,
    cod: generateValidCPF(),
    obs: "Consultora em marketing",
  },
  {
    name: "Pedro Alves Técnico",
    type: PartnerType.PF,
    cod: generateValidCPF(),
    obs: "Técnico em informática",
  },

  // Fornecedores Pessoa Jurídica
  {
    name: "Distribuidora Alpha Ltda",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Fornecedor principal de materiais",
  },
  {
    name: "Logística Beta S/A",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Empresa de transporte e logística",
  },
  {
    name: "Suprimentos Gamma ME",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Fornecedor de suprimentos de escritório",
  },
  {
    name: "Tecnologia Delta Ltda",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Fornecedor de equipamentos de TI",
  },
  {
    name: "Materiais Épsilon Eireli",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Fornecedor de matéria-prima",
  },
  {
    name: "Serviços Zeta Ltda",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Prestação de serviços de limpeza",
  },
  {
    name: "Equipamentos Eta S/A",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Locação de equipamentos industriais",
  },

  // Fornecedores de Serviços Especializados
  {
    name: "Contabilidade Theta Ltda",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Escritório de contabilidade",
  },
  {
    name: "Advocacia Iota & Associados",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Escritório de advocacia empresarial",
  },
  {
    name: "Marketing Kappa Digital",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Agência de marketing digital",
  },
  {
    name: "Segurança Lambda Ltda",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Empresa de segurança patrimonial",
  },
  {
    name: "Manutenção Mi Técnica",
    type: PartnerType.PJ,
    cod: generateValidCNPJ(),
    obs: "Serviços de manutenção predial",
  },
];
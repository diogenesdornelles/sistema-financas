// Enums para status, tipos e transações

export enum RoleType {
  ADMIN = 'admin',
  ANALIST = 'analist',
  MANAGER = 'manager',
  ASSISTANT = 'assistant',
}

export enum RoleSearchType {
  ADMIN = 'admin',
  ANALIST = 'analist',
  MANAGER = 'manager',
  ASSISTANT = 'assistant',
  ALL = 'all',
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

export enum PartnerSearchType {
  PF = 'PF',
  PJ = 'PJ',
  PFPJ = 'PFPJ',
}

export enum TransactionType {
  ENTRY = 'entry',
  OUTFLOW = 'outflow',
}

export enum TransactionSearchType {
  ENTRY = 'entry',
  OUTFLOW = 'outflow',
  BOTH = 'entryoutflow',
}

// Enums para status, tipos e transações
export enum CPStatus {
    PENDING = "pending",
    PAID = "paid",
    CANCELLED = "cancelled",
  }
  
  export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    CANCELLED = "cancelled",
  }
  
  export enum PartnerType {
    PF = "PF",
    PJ = "PJ",
  }
  
  export enum TransactionType {
    ENTRY = "E",
    OUTFLOW = "O",
  }
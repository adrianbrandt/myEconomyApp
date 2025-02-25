// src/types/transaction.types.ts
export interface TransactionDTO {
  title: string;
  amount: number;
  currencyCode?: string;
  debtorAccount: string;
  creditorAccount?: string;
  categoryCode: string;
  bookingDate?: Date;
  valueDate?: Date;
  remittanceInformation?: string;
  paymentMethod: string;
  paymentStatus?: string;
}

export interface TransactionResponse extends TransactionDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTransactionsResponse {
  data: TransactionResponse[];
  count: number;
  page: number;
  limit: number;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  categoryCode?: string;
  debtorAccount?: string;
  bookingDateFrom?: string;
  bookingDateTo?: string;
  paymentMethod?: string;
  paymentStatus?: string;
}
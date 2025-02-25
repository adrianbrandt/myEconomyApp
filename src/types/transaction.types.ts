export interface TransactionDTO {
  title: string;
  amount: number;
  category: string;
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
  category?: string;
}

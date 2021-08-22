export interface TransactionResponseDto {
  id: string;
  fiatAmount: number;
}

export interface TxStreamDataDto {
  clientId: string;
  payload: TransactionResponseDto[];
}

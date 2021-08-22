import { TransactionResponseDto } from './transactions.dto';

export interface StreamDataDto {
  clientId: string;
  payload: TransactionResponseDto;
}

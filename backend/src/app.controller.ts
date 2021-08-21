import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface TransactionResponseDto {
  id: string;
  fiatAmount: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTransactions(): Promise<TransactionResponseDto[]> {
    const tx = await this.appService.getTransactions();
    return tx.map(t => ({
      id: t.id,
      fiatAmount: t.fiatAmount,
    }));
  }
}

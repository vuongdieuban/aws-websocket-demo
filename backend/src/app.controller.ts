import { BadRequestException, Controller, Get, Headers, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { IncomingHttpHeaders } from 'http';
import { Response } from 'express';
import { EventsPublisher } from './events-publisher';
import * as _ from 'lodash';
import { of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Controller('tx')
export class AppController {
  constructor(private readonly appService: AppService, private readonly eventsPublisher: EventsPublisher) {}

  @Get('/sync')
  async getTransactionsSync(@Headers() headers: IncomingHttpHeaders) {
    const clientId = headers['x-clientid'] as string;
    if (!clientId) {
      throw new BadRequestException('ClientId is required in header');
    }

    const tx = await this.appService.getTransactions();
    const formattedTx = tx.map(t => ({
      id: t.id,
      fiatAmount: t.fiatAmount,
    }));

    // mock database delay
    const delayMs = 5000;
    return timer(delayMs).pipe(switchMap(() => of(formattedTx)));
  }

  @Get('/async')
  async getTransactionsASync(@Headers() headers: IncomingHttpHeaders, @Res() response: Response) {
    const clientId = headers['x-clientid'] as string;
    if (!clientId) {
      throw new BadRequestException('ClientId is required in header');
    }

    // immediately terminate the request and reply to the client
    response.json('success');

    const transactions = await this.appService.getTransactions();
    const formattedTx = transactions.map(tx => ({
      id: tx.id,
      fiatAmount: tx.fiatAmount,
    }));

    for (const tx of formattedTx) {
      await timer(1000).toPromise(); // small delay so we don't push too fast
      this.eventsPublisher.publish(clientId, tx);
    }
  }
}

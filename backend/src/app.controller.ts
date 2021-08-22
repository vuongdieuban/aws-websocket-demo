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
    const clientId = headers['x-clientId'] as string;
    if (!clientId) {
      throw new BadRequestException('ClientId is required in header');
    }

    const tx = await this.appService.getTransactions();
    const formattedTx = tx.map(t => ({
      id: t.id,
      fiatAmount: t.fiatAmount,
    }));

    const delayMs = 5000;
    return timer(delayMs).pipe(switchMap(() => of(formattedTx)));
  }

  @Get('/async')
  async getTransactionsASync(@Headers() headers: IncomingHttpHeaders, @Res() response: Response) {
    const clientId = headers['x-clientId'] as string;
    if (!clientId) {
      throw new BadRequestException('ClientId is required in header');
    }

    // immediately terminate the request and reply to the client
    response.json('success');

    const tx = await this.appService.getTransactions();
    const formattedTx = tx.map(t => ({
      id: t.id,
      fiatAmount: t.fiatAmount,
    }));

    const chunkSize = 100;
    const txChunks = _.chunk(formattedTx, chunkSize);
    txChunks.forEach(chunk => this.eventsPublisher.publish(clientId, chunk));
  }
}

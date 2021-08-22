import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { StreamDataDto } from './dto/stream-data.dto';
import { TransactionResponseDto } from './dto/transactions.dto';

@Injectable()
export class EventsPublisher {
  public get txStream$(): Observable<StreamDataDto> {
    // small delay to simulate network delay
    return this.subject.asObservable();
  }

  private readonly subject = new Subject<StreamDataDto>();

  public publish(clientId: string, tx: TransactionResponseDto) {
    this.subject.next({ clientId, payload: tx });
  }
}

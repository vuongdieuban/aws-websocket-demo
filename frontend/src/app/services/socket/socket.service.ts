import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { TransactionResponseDto, TxStreamDataDto } from 'src/app/dtos/tx-data-stream.dto';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  private readonly SOCKET_BACKEND_URL = 'ws://localhost:3000';
  private readonly socketDataSubject = new Subject<TxStreamDataDto>();
  private readonly MOCK_CLIENT_ID = 'b.vuong@ghostlab.ca';

  constructor() {}

  public get socketData$() {
    return this.socketDataSubject.asObservable();
  }

  public initSocket(clientId = this.MOCK_CLIENT_ID) {
    this.socket = io(this.SOCKET_BACKEND_URL, {
      query: {
        'x-clientid': clientId,
      },
    });

    this.socket.on('connection', (data: any) => console.log('connected', data));
    this.socket.on('exception', (data: any) => console.log('Exception in Socket', data));

    this.socket.on('txdata', (data: TxStreamDataDto) => {
      this.socketDataSubject.next(data);
    });

    // small delay to init socket
    return timer(200);
  }

  public disconnectSocket(clientId = this.MOCK_CLIENT_ID) {
    this.socket.disconnect();
  }
}

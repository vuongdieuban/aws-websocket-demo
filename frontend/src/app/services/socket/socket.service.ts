import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  private readonly SOCKET_BACKEND_URL = 'ws://localhost:3000';

  constructor() {}

  public initSocket(clientId = 'b.vuong@ghostlab.ca') {
    this.socket = io(this.SOCKET_BACKEND_URL, {
      query: {
        'x-clientId': clientId,
      },
    });

    this.socket.on('connection', (data: any) => console.log('connected', data));
    this.socket.on('exception', (data: any) => console.log('Exception in Socket', data));
    this.socket.on('tx-data', (data: any) => console.log('tx-data', data));
  }
}

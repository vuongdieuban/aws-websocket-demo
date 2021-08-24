import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: WebSocket;
  private readonly socketDataSubject = new Subject<string>();

  constructor() {}

  public get socketData$() {
    return this.socketDataSubject.asObservable();
  }

  public initSocket(): Observable<void> {
    return new Observable(observer => {
      this.socket = new WebSocket('wss://t4ikpz79bg.execute-api.ca-central-1.amazonaws.com/dev');

      // Listen for messages
      this.socket.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        if (data.message === 'Endpoint request timed out') {
          return;
        }

        const txId = data.txId;
        this.socketDataSubject.next(txId);
      });

      // Connection opened
      this.socket.addEventListener('open', event => {
        observer.next(void 0);
        observer.complete();
      });
    });
  }

  public startDataStream() {
    this.socket.send(JSON.stringify({ action: 'getTx', data: 'Starting from the bottom now we here' }));
  }

  public disconnectSocket() {
    this.socket.close();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly TX_BACKEND_URL = 'http://localhost:3000/tx';
  private readonly fakeClientId = 'b.vuong@ghostlab.ca';

  private get txData$() {
    return this.socketService.socketData$.pipe(map(data => data.payload));
  }

  constructor(private readonly http: HttpClient, private readonly socketService: SocketService) {}

  public getTxSync(clientId = this.fakeClientId) {
    const url = `${this.TX_BACKEND_URL}/sync`;
    const headers = this.generateHttpHeaders(clientId);
    return this.http.get(url, headers);
  }

  public getTxAsync(clientId = this.fakeClientId) {
    const url = `${this.TX_BACKEND_URL}/async`;
    const headers = this.generateHttpHeaders(clientId);
    return this.http.get(url, headers).pipe(switchMap(() => this.txData$));
  }

  private generateHttpHeaders(clientId: string) {
    return { headers: { 'x-clientId': clientId } };
  }
}

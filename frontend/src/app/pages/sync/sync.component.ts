import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TransactionResponseDto } from 'src/app/dtos/tx-data-stream.dto';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent implements OnInit, OnDestroy {
  public txData: TransactionResponseDto[] = [];
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly txService: TransactionsService) {}

  async ngOnInit() {
    const socket = new WebSocket('wss://g7gdtdvrwg.execute-api.ca-central-1.amazonaws.com/dev');

    // Connection opened
    socket.addEventListener('open', function (event) {
      socket.send(JSON.stringify({ action: 'getTx', data: 'LOL' }));
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
    });

    const data = await this.txService.getTxSync().pipe(take(1)).toPromise();
    this.txData = data;
    console.log('SyncData', data);
  }

  // ngOnInit() {
  //   const sub = this.txService.getTxSync().subscribe(data => {
  //     console.log('Async data', data);
  //   });
  //   this.subscriptions.push(sub);
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

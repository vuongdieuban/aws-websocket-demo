import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { bufferCount, concatMap, map, mergeAll, switchMap, tap, throttleTime } from 'rxjs/operators';
import { SocketService } from 'src/app/services/socket/socket.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.scss'],
})
export class AsyncComponent implements OnInit, OnDestroy {
  public txDataSub: Subscription = new Subscription();
  private readonly displayClickSubject = new Subject();

  private get displayClicked$() {
    return this.displayClickSubject.asObservable();
  }

  constructor(
    private readonly socketService: SocketService,
    private readonly txService: TransactionsService,
  ) {}

  ngOnInit(): void {
    this.txDataSub = this.socketService
      .initSocket()
      .pipe(
        switchMap(() => this.txService.getTxAsync()),
        bufferCount(5),
        concatMap(txDataChunk =>
          this.displayClicked$.pipe(
            throttleTime(500),
            map(() => txDataChunk),
          ),
        ),
        tap(data => console.log('ChunkedData', data)),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.txDataSub.unsubscribe();
  }

  public handleDisplayClicked() {
    this.displayClickSubject.next();
  }
}

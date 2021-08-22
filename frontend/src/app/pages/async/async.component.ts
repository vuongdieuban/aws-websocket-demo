import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { bufferToggle, filter, mergeAll, switchMap, take, windowToggle } from 'rxjs/operators';
import { TransactionResponseDto } from 'src/app/dtos/tx-data-stream.dto';
import { SocketService } from 'src/app/services/socket/socket.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.scss'],
})
export class AsyncComponent implements OnInit, OnDestroy {
  public txData: TransactionResponseDto[] = [];

  private readonly subscriptions: Subscription[] = [];
  private readonly releaseSubject = new BehaviorSubject<boolean>(false);

  private get release$() {
    return this.releaseSubject.asObservable();
  }

  private get releaseOn$() {
    return this.release$.pipe(filter(v => v));
  }

  private get releaseOff$() {
    return this.release$.pipe(filter(v => !v));
  }

  constructor(
    private readonly socketService: SocketService,
    private readonly txService: TransactionsService,
  ) {}

  ngOnInit(): void {
    const buffer$ = this.txService.txData$.pipe(bufferToggle(this.releaseOff$, val => this.releaseOn$));
    const window$ = this.txService.txData$.pipe(windowToggle(this.releaseOn$, val => this.releaseOff$));

    const display$ = merge(buffer$, window$).pipe(mergeAll());

    const sub = this.socketService
      .initSocket()
      .pipe(
        switchMap(() => this.txService.getTxAsync()),
        switchMap(() => display$),
      )
      .subscribe(tx => {
        this.txData.push(tx);
      });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.socketService.disconnectSocket();
  }

  public handleReleaseClicked() {
    this.release$.pipe(take(1)).subscribe(val => this.releaseSubject.next(!val));
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject, Subscription } from 'rxjs';
import { bufferToggle, mergeAll, switchMap, windowToggle } from 'rxjs/operators';
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
  private readonly windowOnSubject = new Subject();
  private readonly windowOffSubject = new Subject();
  private toggleOn = true;

  private get windowOn$() {
    return this.windowOnSubject.asObservable();
  }

  private get windowOff$() {
    return this.windowOffSubject.asObservable();
  }

  constructor(
    private readonly socketService: SocketService,
    private readonly txService: TransactionsService,
  ) {}

  ngOnInit(): void {
    const window$ = this.txService.txData$.pipe(windowToggle(this.windowOn$, val => this.windowOff$));
    const buffer$ = this.txService.txData$.pipe(bufferToggle(this.windowOff$, val => this.windowOn$));

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
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public handleToggleClicked() {
    if (this.toggleOn) {
      this.windowOnSubject.next();
    } else {
      this.windowOffSubject.next();
    }
    this.toggleOn = !this.toggleOn;
  }
}

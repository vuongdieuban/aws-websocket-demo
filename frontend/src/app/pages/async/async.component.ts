import { Component, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
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
    const source$ = this.socketService.initSocket().pipe(switchMap(() => this.txService.getTxAsync()));
    const window$ = source$.pipe(windowToggle(this.windowOn$, val => this.windowOff$));
    const buffer$ = source$.pipe(bufferToggle(this.windowOff$, val => this.windowOn$));

    merge(buffer$, window$)
      .pipe(mergeAll())
      .subscribe(tx => {
        this.txData.push(tx);
      });
  }

  ngOnDestroy() {}

  public handleToggleClicked() {
    if (this.toggleOn) {
      this.windowOnSubject.next();
    } else {
      this.windowOffSubject.next();
    }
    this.toggleOn = !this.toggleOn;
  }
}

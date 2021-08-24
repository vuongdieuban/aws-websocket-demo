import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { bufferToggle, filter, mergeAll, switchMap, take, tap, windowToggle } from 'rxjs/operators';
import { SocketService } from 'src/app/services/socket/socket.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.scss'],
})
export class AsyncComponent implements OnInit, OnDestroy {
  public txData: string[] = [];

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

  constructor(private readonly socketService: SocketService) {}

  ngOnInit(): void {
    const buffer$ = this.socketService.socketData$.pipe(
      bufferToggle(this.releaseOff$, val => this.releaseOn$),
    );
    const window$ = this.socketService.socketData$.pipe(
      windowToggle(this.releaseOn$, val => this.releaseOff$),
    );

    const display$ = merge(buffer$, window$).pipe(mergeAll());

    const sub = this.socketService
      .initSocket()
      .pipe(
        tap(() => this.socketService.startDataStream()),
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

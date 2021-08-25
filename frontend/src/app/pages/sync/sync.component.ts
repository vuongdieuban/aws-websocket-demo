import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent implements OnInit, OnDestroy {
  public txData: string[] = [];
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly txService: TransactionsService) {}

  async ngOnInit() {
    const data = await this.txService.getTxSync().pipe(take(1)).toPromise();
    this.txData = data;
    console.log('SyncData', data);
  }

  // ngOnInit() {
  //   const sub = this.txService.getTxSync().subscribe(data => {
  //     console.log('Async data', data);
  //     this.txData = data;
  //   });
  //   this.subscriptions.push(sub);
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

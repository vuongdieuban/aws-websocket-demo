import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private readonly http: HttpClient) {}

  public getTxSync() {
    const url = 'https://fh4wopuglj.execute-api.ca-central-1.amazonaws.com/';
    return this.http.get(url);
  }
}

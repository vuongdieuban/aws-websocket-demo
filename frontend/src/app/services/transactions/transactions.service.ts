import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private readonly http: HttpClient) {}

  public getTxSync(): Observable<string[]> {
    const url = 'https://fh4wopuglj.execute-api.ca-central-1.amazonaws.com/';
    return this.http.get<{ data: string[] }>(url).pipe(map(d => d.data));
  }
}

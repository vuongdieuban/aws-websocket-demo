import { Component } from '@angular/core';
import { fromEvent, of, Subject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rxjs-demo';

  ngOnInit() {
    const getData = () => {
      const data = Math.random();
      return of(data);
    };

    getData().subscribe(data => {
      console.log('Subsriber A - ', data); // data = 123
    });

    getData().subscribe(data => {
      console.log('Subsriber B - ', data); // data = 456
    });
  }

  private doSomething(key: string) {}
}

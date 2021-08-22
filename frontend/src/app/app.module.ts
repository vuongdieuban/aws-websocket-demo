import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AsyncComponent } from './pages/async/async.component';
import { HelloComponent } from './pages/hello/hello.component';
import { SyncComponent } from './pages/sync/sync.component';

@NgModule({
  declarations: [AppComponent, SyncComponent, AsyncComponent, HelloComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MatSidenavModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsyncComponent } from './pages/async/async.component';
import { HelloComponent } from './pages/hello/hello.component';
import { SyncComponent } from './pages/sync/sync.component';

const routes: Routes = [
  { path: 'tx/sync', component: SyncComponent },
  { path: 'tx/async', component: AsyncComponent },
  { path: 'hello', component: HelloComponent },
  { path: '', redirectTo: '/hello', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

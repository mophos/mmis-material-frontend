import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DenyComponent } from 'app/deny/deny.component';
import { PageNotFoundComponent } from 'app/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'access-denied', component: DenyComponent },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

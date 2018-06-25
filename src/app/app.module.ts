import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';

import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';
import { ClarityModule } from '@clr/angular';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DenyComponent } from './deny/deny.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DenyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AdminModule,
    LoginModule,
    ClarityModule.forRoot(),
    AgxTypeaheadModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: 'HOME_URL', useValue: environment.homeUrl },
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: 'MCD_URL', useValue: environment.mcdUrl },
    { provide: 'DOC_URL', useValue: environment.docUrl },
    { provide: 'LOGIN_URL', useValue: environment.loginUrl },
    { provide: 'PRODUCT_IMAGE_PREFIX', useValue: environment.productImagePrefix },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

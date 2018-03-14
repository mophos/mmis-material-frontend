import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { LoginService } from './login.service';
import { ClarityModule } from '@clr/angular';

import { AuthModule } from '../auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ClarityModule,
    FormsModule,
    AuthModule
  ],
  providers: [LoginService],
  declarations: [LoginComponent]
})
export class LoginModule { }

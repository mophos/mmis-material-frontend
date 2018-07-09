import { AlertService } from './../admin/alert.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  isLogging = false;
  isError = false;
  errorMessage: string;
  warehouses = [];
  warehouseId: any;
  jwtHelper: JwtHelper = new JwtHelper();
  token: string;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token');
  }

  doLogin() {
    if (this.username && this.password) {
      this.isError = false;
      this.isLogging = true;
      this.loginService.doLogin(this.username, this.password, this.warehouseId)
        .then((resp: any) => {
          this.isLogging = false;
          if (resp.ok) {
            const decodedToken = this.jwtHelper.decodeToken(resp.token);
            sessionStorage.setItem('token', resp.token);
            sessionStorage.setItem('fullname', decodedToken.fullname);
            this.router.navigate(['admin']);
          } else {
            this.alertService.error(resp.error);
          }
        })
        .catch(err => {
          console.log(err);
          this.isLogging = false;
          this.alertService.serverError();
        });
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  enterLogin(event) {
    if (event.charCode === 13) {
      this.doLogin();
    }
  }

  ngOnInit() {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      const accessRight = decodedToken.accessRight;
      const rights = accessRight.split(',');

      if (_.indexOf(rights, 'MM_ADMIN') > -1) {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['login']);
      }
    }
  }

  async selectWarehouse(event) {
    const rs: any = await this.loginService.searchWarehouse(this.username);
    if (rs.ok) {
      this.warehouses = rs.rows;
      this.warehouseId = rs.rows[0].warehouse_id;
    } else {
      this.warehouses = [];
      this.warehouseId = null;
    }
  }

}

import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericDrugAccountsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-accounts`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(drugAccountName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-accounts`, {
        drugAccountName: drugAccountName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(drugAccountId: string, drugAccountName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-accounts/${drugAccountId}`, {
        drugAccountName: drugAccountName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(drugAccountId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/drug-accounts/${drugAccountId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

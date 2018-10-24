import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericDrugAccountsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all(btnDelete:boolean) {
    let btnD = btnDelete ? 'Y': 'N';
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-accounts/${btnD}`)
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
  async returnDelete(id:any){
    const rs:any = await this.authHttp.delete(`${this.url}/drug-accounts/re-deleted?id=${id}`).toPromise();
    return rs.json();
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

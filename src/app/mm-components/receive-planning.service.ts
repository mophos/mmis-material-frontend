import { AuthHttp } from 'angular2-jwt';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class ReceivePlanningService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }
  // async getWarehouse(genericId) {
  //   const resp = await this.authHttp.get(`${this.url}/receive-planning/${genericId}`).toPromise();
  //   return resp.json();
  // }

  getWarehouse(genericId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/receive-planning/${genericId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(genericId: any, warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/receive-planning`,
        {
          genericId: genericId,
          warehouseId: warehouseId
        })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(genericId: any, warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/receive-planning?genericId=${genericId}&warehouseId=${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}

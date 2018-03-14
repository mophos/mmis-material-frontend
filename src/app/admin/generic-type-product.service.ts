import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericTypesProductService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/type-product`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(typeName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/type-product`, {
        typeName: typeName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(typeId: string, typeName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/type-product/${typeId}`, {
        typeName: typeName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(typeId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/type-product/${typeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

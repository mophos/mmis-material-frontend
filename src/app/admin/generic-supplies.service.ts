import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericSuppliesService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/generics-medical-supplies`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveGeneric(supplies: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/generics-medical-supplies`, {
        supplies: supplies
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  updateGeneric(genericId: string, supplies: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/generics-medical-supplies/${genericId}`, {
        supplies: supplies
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeGeneric(genericId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/generics-medical-supplies/${genericId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

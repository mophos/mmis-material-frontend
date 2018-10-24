import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericDrugTypesService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all(btnD:any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-types/${btnD}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  async returnDelete(id:any){
    const rs:any = await this.authHttp.delete(`${this.url}/drug-types/re-deleted?id=${id}`).toPromise();
    return rs.json();
  }
  save(typeName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-types`, {
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
      this.authHttp.put(`${this.url}/drug-types/${typeId}`, {
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
      this.authHttp.delete(`${this.url}/drug-types/${typeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

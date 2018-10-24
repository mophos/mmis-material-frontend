import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericTypesProductService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all(deleted: boolean) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/type-product?deleted=${deleted}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  async returnDelete(id: any) {
    const rs: any = await this.authHttp.post(`${this.url}/type-product/return`,
      {
        id: id
      }).toPromise();
    return rs.json();
  }

  save(typeName: string, prefixName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/type-product`, {
        typeName: typeName,
        prefixName: prefixName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(typeId: string, typeName: string, prefixName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/type-product/${typeId}`, {
        typeName: typeName,
        prefixName: prefixName
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

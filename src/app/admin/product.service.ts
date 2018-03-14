import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProductService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  save(products: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/products`, {
        products: products
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  fastSave(products: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/products/fast-save`,products)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async generateWorkingCode(productId: any, typeId: any) {
    let rs: any = await this.authHttp.post(`${this.url}/products/generate-workingcode`, {
      productId: productId,
      typeId: typeId
    }).toPromise();

    return rs;
  }

  update(productId: string, data: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/products/${productId}`, data)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async all(limit: number = 15, offset: number = 0, groupId: any) {
    let rs = await this.authHttp.get(`${this.url}/products?limit=${limit}&offset=${offset}&groupId=${groupId}`).toPromise();
    return rs.json();
  }

  async search(query: any, limit: number, offset: number, groupId: any) {
    let rs = await this.authHttp.get(`${this.url}/products/search?query=${query}&limit=${limit}&offset=${offset}&groupId=${groupId}`).toPromise();
    return rs.json();
  }

  remove(packageId) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/products/${packageId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  detail(productId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/products/detail/${productId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductGroups() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/product-groups`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async markDeleted(productId: any) {
    let rs = await this.authHttp.delete(`${this.url}/products/mark-deleted/${productId}`, {}).toPromise();
    return rs.json();
  }

  async getConversions(productId: any) {
    let rs = await this.authHttp.get(`${this.url}/units/conversion/${productId}`).toPromise();
    return rs.json();
  }


}

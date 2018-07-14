import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
@Injectable()
export class ProductGroupsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  async list() {
    const rs: any = await this.authHttp.get(`${this.url}/product-groups`).toPromise();
    return rs.json();
  }

  async remove(productGroupId) {
    const rs: any = await this.authHttp.delete(`${this.url}/product-groups?productGroupId=${productGroupId}`).toPromise();
    return rs.json();
  }

  async save(productGroupName) {
    const rs: any = await this.authHttp.post(`${this.url}/product-groups`, { productGroupName: productGroupName }).toPromise();
    return rs.json();
  }

  async update(productGroupId, productGroupName) {
    const rs: any = await this.authHttp.put(`${this.url}/product-groups`, {
      productGroupId: productGroupId,
      productGroupName: productGroupName
    }).toPromise();
    return rs.json();
  }
}

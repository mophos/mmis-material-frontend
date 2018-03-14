import { AuthHttp } from 'angular2-jwt';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class OrderModifierService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getWarehouses() {
    const resp = await this.authHttp.get(`${this.url}/std/warehouses`).toPromise();
    return resp.json();
  }

  async getMinMaxProducts(productId: any) {
    const resp = await this.authHttp.get(`${this.url}/modifiers/${productId}`).toPromise();
    return resp.json();
  }

  async saveMinMax(warehouseId: any, productId: any, minQty: number, maxQty: number, isActive: any) {
    const resp = await this.authHttp.post(`${this.url}/modifiers/${productId}`, {
      warehouseId: warehouseId,
      minQty: minQty,
      maxQty: maxQty,
      isActive: isActive
    }).toPromise();
    return resp.json();
  }

  async updateMinMax(productOrderModifierId: any, minQty: number, maxQty: number, isActive: any) {
    const resp = await this.authHttp.put(`${this.url}/modifiers/${productOrderModifierId}`, {
      minQty: minQty,
      maxQty: maxQty,
      isActive: isActive
    }).toPromise();
    return resp.json();
  }

  async removeMinMaxProducts(productOrderModifierId: any) {
    const resp = await this.authHttp.delete(`${this.url}/modifiers/${productOrderModifierId}`).toPromise();
    return resp.json();
  }

}

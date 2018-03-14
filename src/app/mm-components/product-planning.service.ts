import { AuthHttp } from 'angular2-jwt';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProductPlanningService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getWarehouses() {
    const resp = await this.authHttp.get(`${this.url}/std/warehouses`).toPromise();
    return resp.json();
  }

  async getPlanning(productId: any) {
    const resp = await this.authHttp.get(`${this.url}/products/planning/${productId}`).toPromise();
    return resp.json();
  }

  async savePlanning(warehouseId: any, productId: any, minQty: number, maxQty: number,
    minModifier: number, isActive: any, sourceWarehouseId: any, primaryUnitId: any, requisitionQuotaQty: any) {
    const resp = await this.authHttp.post(`${this.url}/products/planning/${productId}`, {
      warehouseId: warehouseId,
      minQty: minQty,
      maxQty: maxQty,
      isActive: isActive,
      minModifier: minModifier,
      sourceWarehouseId: sourceWarehouseId,
      primaryUnitId: primaryUnitId,
      requisitionQuotaQty: requisitionQuotaQty
    }).toPromise();
    return resp.json();
  }

  async updatePlanning(productPlanningId: any, minQty: number, maxQty: number,
    minModifier: any, isActive: any, sourceWarehouseId: any,
  primaryUnitId: any, requisitionQuotaQty: any) {
    const resp = await this.authHttp.put(`${this.url}/products/planning/${productPlanningId}`, {
      minQty: minQty,
      maxQty: maxQty,
      isActive: isActive,
      minModifier: minModifier,
      sourceWarehouseId: sourceWarehouseId,
      primaryUnitId: primaryUnitId,
      requisitionQuotaQty: requisitionQuotaQty
    }).toPromise();
    return resp.json();
  }


  async removePlanning(productPlanningId: any) {
    const resp = await this.authHttp.delete(`${this.url}/products/planning/${productPlanningId}`).toPromise();
    return resp.json();
  }


}

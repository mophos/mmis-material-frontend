import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenericPlanningService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getWarehouses() {
    const resp = await this.authHttp.get(`${this.url}/std/warehouses`).toPromise();
    return resp.json();
  }

  async getPlanning(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/generics/planning/${genericId}`).toPromise();
    return resp.json();
  }

  async savePlanning(warehouseId: any, genericId: any, minQty: number, maxQty: number,
    minModifier: number, isActive: any, sourceWarehouseId: any, primaryUnitId: any, requisitionQuotaQty: any) {
    const resp = await this.authHttp.post(`${this.url}/generics/planning/${genericId}`, {
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

  async updatePlanning(genericPlanningId: any, minQty: number, maxQty: number,
    minModifier: any, isActive: any, sourceWarehouseId: any,
    primaryUnitId: any, requisitionQuotaQty: any) {
    const resp = await this.authHttp.put(`${this.url}/generics/planning/${genericPlanningId}`, {
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

  async removePlanning(genericPlanningId: any) {
    const resp = await this.authHttp.delete(`${this.url}/generics/planning/${genericPlanningId}`).toPromise();
    return resp.json();
  }
}

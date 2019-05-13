import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenericService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getListByTypes(typeFilterId: any, limit: number, offset: number, deleted: boolean, sort = {}) {
    const rs: any = await this.authHttp.post(`${this.url}/generics/list-type`, {
      typeId: typeFilterId,
      limit: limit,
      offset: offset,
      deleted: deleted,
      sort: sort
    }).toPromise();
    return rs.json();
  }

  async search(query: any, genericType: any, limit: number, offset: number, deleted: boolean, sort = {}) {
    const rs: any = await this.authHttp.post(`${this.url}/generics/search`, {
      query: query,
      genericType: genericType,
      limit: limit,
      offset: offset,
      deleted: deleted,
      sort: sort
    }).toPromise();
    return rs.json();
  }

  async saveGeneric(drugs: any) {
    const rs: any = await this.authHttp.post(`${this.url}/generics`, {
      drugs: drugs
    }).toPromise();
    return rs.json();
  }

  async searchDC24(q: any) {
    const rs: any = await this.authHttp.get(`${this.url}/generics/search/dc24?q=${q}`).toPromise();
    return rs.json();
  }

  async getDetail(genericId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/generics/detail/${genericId}`).toPromise();
    return rs.json();
  }

  async saveExpiredAlert(generic_id: any, expired: any) {
    const rs: any = await this.authHttp.get(`${this.url}/generics/expired-alert/${generic_id}/${expired}`).toPromise();
    return rs.json();
  }

  async getGenericType() {
    const rs: any = await this.authHttp.get(`${this.url}/generics/generic-type`).toPromise();
    return rs.json();
  }

  async updateGeneric(genericId: string, generics: any) {
    const rs: any = await this.authHttp.put(`${this.url}/generics/${genericId}`, {
      generics: generics
    }).toPromise();
    return rs.json();
  }

  async removeGeneric(genericId: string) {
    const rs: any = await this.authHttp.delete(`${this.url}/generics?genericId=${genericId}`).toPromise();
    return rs.json();
  }

  async returnDelete(genericId: string) {
    const rs: any = await this.authHttp.post(`${this.url}/generics/return`,
      {
        genericId: genericId
      }).toPromise();
    return rs.json();
  }

  async getTypes() {
    const rs: any = await this.authHttp.delete(`${this.url}/generics/types`).toPromise();
    return rs.json();
  }

  async getGenericPlanning(warehouseId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/generics/planning-detail?warehouseId=${warehouseId}`).toPromise();
    return rs.json();
  }

  async updateMin(genericPlanningId: any, minQty: any) {
    const rs: any = await this.authHttp.put(`${this.url}/generics/planning-detail/min?genericPlanningId=${genericPlanningId}`, {
      min_qty: minQty
    }).toPromise();
    return rs.json();
  }

  async updateMax(genericPlanningId: any, maxQty: any) {
    const rs: any = await this.authHttp.put(`${this.url}/generics/planning-detail/max?genericPlanningId=${genericPlanningId}`, {
      max_qty: maxQty
    }).toPromise();
    return rs.json();
  }

  async addAllGenericPlanning(warehouseId: any, genericTypeId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/generics/addall/generic/${warehouseId}/${genericTypeId}`).toPromise();
    return rs.json();
  }

  async addGenericPlanning(warehouseId: any, data: any) {
    const rs: any = await this.authHttp.post(`${this.url}/generics/add/generics`, {
      warehouseId: warehouseId,
      data: data
    }).toPromise();
    return rs.json();
  }

  async addGenericPlanningByWarehouse(srcWarehouseId: any, dstWarehouseId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/generics/add/generics/warehouse?srcWarehouseId=${srcWarehouseId}&dstWarehouseId=${dstWarehouseId}`).toPromise();
    return rs.json();
  }

  async deleteGenericWarehouse(warehouseId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/generics/delete/generic/planning/${warehouseId}`).toPromise();
    return rs.json();
  }

  async deleteGenericPlanning(genericPlanningId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/generics/delete/generic/planning/id/${genericPlanningId}`).toPromise();
    return rs.json();
  }

}

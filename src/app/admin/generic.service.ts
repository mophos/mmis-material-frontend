import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenericService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getListByTypes(typeFilterId: any, limit: number, offset: number, deleted: boolean) {
    const rs: any = await this.authHttp.post(`${this.url}/generics/list-type`, {
      typeId: typeFilterId,
      limit: limit,
      offset: offset,
      deleted: deleted
    }).toPromise();
    return rs.json();
  }

  async search(query: any, groupId: any, limit: number, offset: number, deleted: boolean) {
    const rs: any = await this.authHttp.post(`${this.url}/generics/search`, {
      query: query,
      groupId: groupId,
      limit: limit,
      offset: offset,
      deleted: deleted
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
    const rs: any = await this.authHttp.delete(`${this.url}/generics?=${genericId}`).toPromise();
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

}

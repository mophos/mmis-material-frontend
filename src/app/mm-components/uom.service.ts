import { AuthHttp } from 'angular2-jwt';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UomService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getActiveUnits() {
    const resp = await this.authHttp.get(`${this.url}/units/active`).toPromise();
    return resp.json();
  }

  async getActiveGenericUnits(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/units/active/${genericId}`).toPromise();
    return resp.json();
  }

  async getPrimaryUnits() {
    const resp = await this.authHttp.get(`${this.url}/units/active-primary`).toPromise();
    return resp.json();
  }

  async saveConversion(genericId: any, fromUnitId: any, toUnitId: any, qty: number, isActive: any, cost: any) {
    const resp = await this.authHttp.post(`${this.url}/units/conversion/${genericId}`, {
      fromUnitId: fromUnitId,
      toUnitId: toUnitId,
      qty: qty,
      isActive: isActive,
      cost: cost
    }).toPromise();
    return resp.json();
  }

  async saveActive(unitGenericId: any, status: any) {
    const resp = await this.authHttp.put(`${this.url}/units/conversion/active`, {
      unitGenericId: unitGenericId,
      status: status
    }).toPromise();
    return resp.json();
  }

  async updateConversion(genericId: any, unitGenericId: any, fromUnitId: any, toUnitId: any, qty: number, cost: any) {
    const resp = await this.authHttp.put(`${this.url}/units/conversion`, {
      genericId: genericId,
      unitGenericId: unitGenericId,
      fromUnitId: fromUnitId,
      toUnitId: toUnitId,
      qty: qty,
      cost: cost
    }).toPromise();
    return resp.json();
  }

  async updateConversionPlanning(genericId: any, unitGenericId: any) {
    const resp = await this.authHttp.put(`${this.url}/units/conversion/planning`, {
      genericId: genericId,
      unitGenericId: unitGenericId
    }).toPromise();
    return resp.json();
  }

  async getConversionList(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/units/conversion/${genericId}`).toPromise();
    return resp.json();
  }

  async getPrimaryUnit(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/units/generic/primary-unit/${genericId}`).toPromise();
    return resp.json();
  }

  async removeConversion(unitProductId: any) {
    const resp = await this.authHttp.delete(`${this.url}/units/conversion/${unitProductId}`).toPromise();
    return resp.json();
  }

}

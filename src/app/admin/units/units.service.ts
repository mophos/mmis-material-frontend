import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UnitsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async all() {
    const resp = await this.authHttp.get(`${this.url}/units`).toPromise();
    return resp.json();
  }

  async save(unitCode: string, unitName: string, isActive: string, isPrimary: string) {
    const resp = await this.authHttp.post(`${this.url}/units`, {
      isActive: isActive,
      isPrimary: isPrimary,
      unitName: unitName,
      unitCode: unitCode
    }).toPromise();
    return resp.json();
  }

  async update(unitId: any, unitCode: string, unitName: string, isActive: string, isPrimary: string) {
    const resp = await this.authHttp.put(`${this.url}/units/${unitId}`, {
      isActive: isActive,
      isPrimary: isPrimary,
      unitName: unitName,
      unitCode: unitCode
    }).toPromise();
    return resp.json();
  }

  async remove(unitId: any) {
    const resp = await this.authHttp.delete(`${this.url}/units/${unitId}`).toPromise();
    return resp.json();
  }

  async getPrimaryUnits() {
    const resp = await this.authHttp.get(`${this.url}/units/primary`).toPromise();
    return resp.json();
  }

  async getNotPrimaryUnits() {
    const resp = await this.authHttp.get(`${this.url}/units/not-primary`).toPromise();
    return resp.json();
  }

}

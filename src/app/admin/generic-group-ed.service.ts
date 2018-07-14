import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
@Injectable()
export class GenericGroupEDService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  async list() {
    const rs: any = await this.authHttp.get(`${this.url}/generic-group-ed`).toPromise();
    return rs.json();
  }

  async remove(genericGroupEDId) {
    const rs: any = await this.authHttp.delete(`${this.url}/generic-group-ed?genericGroupEDId=${genericGroupEDId}`).toPromise();
    return rs.json();
  }

  async save(genericGroupEDName) {
    const rs: any = await this.authHttp.post(`${this.url}/generic-group-ed`, { genericGroupEDName: genericGroupEDName }).toPromise();
    return rs.json();
  }

  async update(genericGroupEDId, genericGroupEDName) {
    const rs: any = await this.authHttp.put(`${this.url}/generic-group-ed`, {
      genericGroupEDId: genericGroupEDId,
      genericGroupEDName: genericGroupEDName
    }).toPromise();
    return rs.json();
  }
}

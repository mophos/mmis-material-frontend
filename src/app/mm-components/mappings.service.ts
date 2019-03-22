import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class MappingsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async saveMappgins(productId, data) {
    const resp = await this.authHttp.post(`${this.url}/mappings/`, {
      productId: productId,
      data: data
    }).toPromise();
    return resp.json();
  }

  async getMappgins(productId) {
    const resp = await this.authHttp.get(`${this.url}/mappings?productId=${productId}`).toPromise();
    return resp.json();
  }


  async getTmtCode(productId) {
    const resp = await this.authHttp.get(`${this.url}/mappings/tmt-code?productId=${productId}`).toPromise();
    return resp.json();
  }
}

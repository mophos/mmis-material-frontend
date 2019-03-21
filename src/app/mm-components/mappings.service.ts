import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class MappingsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async saveEdiLabelerCode(productId, ediLabelerCode) {
    const resp = await this.authHttp.post(`${this.url}/mappings/edi-labeler-code`, {
      productId: productId,
      ediLabelerCode: ediLabelerCode
    }).toPromise();
    return resp.json();
  }

  async getEdiLabelerCode(productId) {
    const resp = await this.authHttp.get(`${this.url}/mappings/edi-labeler-code?productId=${productId}`).toPromise();
    return resp.json();
  }
}

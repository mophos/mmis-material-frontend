import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StandardService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  getLabelerTypes() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/labeler-types`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getLabelerStatus() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/labeler-status`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getCountries() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/countries`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getChangwat() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/changwat`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getAmpur(changwatCode: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/std/ampur`, { changwatCode: changwatCode })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getTambon(changwatCode: string, ampurCode: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/std/tambon`, {
        changwatCode: changwatCode,
        ampurCode: ampurCode
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getGenericTypes() {
    const rs: any = await this.authHttp.get(`${this.url}/std/generic-types`).toPromise();
    return rs.json();
  }

  async getGenericAccount() {
    const rs: any = await this.authHttp.get(`${this.url}/std/generic-accounts`).toPromise();
    return rs.json();
  }

  async getProductTypes() {
    const rs: any = await this.authHttp.get(`${this.url}/std/type-product`).toPromise();
    return rs.json();
  }


  async getBidTypes() {
    const rs: any = await this.authHttp.get(`${this.url}/std/bid-types`).toPromise();
    return rs.json();
  }

  getGenericGroups1() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/generic-groups/1`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getGenericGroups2(groupCode1: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/generic-groups/2?groupCode1=${groupCode1}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getGenericGroups3(groupCode1: string, groupCode2: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/generic-groups/3?groupCode1=${groupCode1}&groupCode2=${groupCode2}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  getGenericGroups4(groupCode1: string, groupCode2: string, groupCode3: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/generic-groups/4?groupCode1=${groupCode1}&groupCode2=${groupCode2}&groupCode3=${groupCode3}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getGenericTypeLV1() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/generic-type-lv1`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getGenericTypeLV2(genericTypeLV1Id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/generic-type-lv2?genericTypeLV1Id=${genericTypeLV1Id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getGenericTypeLV3(genericTypeLV1Id: string, genericTypeLV2Id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/generic-type-lv3?genericTypeLV1Id=${genericTypeLV1Id}&genericTypeLV2Id=${genericTypeLV2Id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getGenericDosages() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/generic-dosages`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getED() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/std/ed`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getWarehouses() {
    const resp = await this.authHttp.get(`${this.url}/std/warehouses`).toPromise();
    return resp.json();
  }

  async search(query: any) {
    const rs: any = await this.authHttp.get(`${this.url}/std/search/warehouses?query=${query}`).toPromise();
    return rs.json();
  }
}

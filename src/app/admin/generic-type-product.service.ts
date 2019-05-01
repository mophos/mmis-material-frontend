import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericTypesProductService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all(deleted: boolean) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/type-product?deleted=${deleted}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  genericTypeLV1(deleted: boolean) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/type-product/lv1?deleted=${deleted}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  genericTypeLV2(deleted: boolean) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/type-product/lv2?deleted=${deleted}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  genericTypeLV3(deleted: boolean) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/type-product/lv3?deleted=${deleted}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async returnDeleteLV1(id: any) {
    const rs: any = await this.authHttp.post(`${this.url}/type-product/return/lv1`,
      {
        id: id
      }).toPromise();
    return rs.json();
  }

  async returnDeleteLV2(id: any) {
    const rs: any = await this.authHttp.post(`${this.url}/type-product/return/lv2`,
      {
        id: id
      }).toPromise();
    return rs.json();
  }

  async returnDeleteLV3(id: any) {
    const rs: any = await this.authHttp.post(`${this.url}/type-product/return/lv3`,
      {
        id: id
      }).toPromise();
    return rs.json();
  }

  saveLV1(genericTypeLV1Name: string, prefixName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/type-product/lv1`, {
        genericTypeLV1Name: genericTypeLV1Name,
        prefixName: prefixName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveLV2(genericTypeLV2Name: string, genericTypeLV1Id: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/type-product/lv2`, {
        genericTypeLV2Name: genericTypeLV2Name,
        genericTypeLV1Id: genericTypeLV1Id
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveLV3(genericTypeLV3Name: string, genericTypeLV1Id: number, genericTypeLV2Id: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/type-product/lv3`, {
        genericTypeLV3Name: genericTypeLV3Name,
        genericTypeLV2Id: genericTypeLV2Id,
        genericTypeLV1Id: genericTypeLV1Id
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  updateLV1(genericTypeLV1Id: string, genericTypeLV1Name: string, prefixName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/type-product/lv1/${genericTypeLV1Id}`, {
        genericTypeLV1Name: genericTypeLV1Name,
        prefixName: prefixName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  updateLV2(genericTypeLV2Id: number, genericTypeLV2Name: string, genericTypeLV1Id: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/type-product/lv2/${genericTypeLV2Id}`, {
        genericTypeLV2Name: genericTypeLV2Name,
        genericTypeLV1Id: genericTypeLV1Id
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  updateLV3(genericTypeLV3Id: number, genericTypeLV3Name: string, genericTypeLV1Id: number, genericTypeLV2Id: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/type-product/lv3/${genericTypeLV3Id}`, {
        genericTypeLV3Name: genericTypeLV3Name,
        genericTypeLV1Id: genericTypeLV1Id,
        genericTypeLV2Id: genericTypeLV2Id
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeLV1(typeId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/type-product/lv1/${typeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeLV2(typeId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/type-product/lv2/${typeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeLV3(typeId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/type-product/lv3/${typeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

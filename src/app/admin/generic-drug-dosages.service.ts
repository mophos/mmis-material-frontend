import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericDrugDosagesService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }
  async isActive(id: any, isActive: any) {
    
    let res = await this.authHttp.post(`${this.url}/drug-dosages/isactive`, {
      id: id,
      isActive: isActive
    }).toPromise();
    return res.json();
  }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-dosages/all`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(dosageName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-dosages`, {
        dosageName: dosageName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(dosageId: string, dosageName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-dosages/${dosageId}`, {
        dosageName: dosageName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(dosageId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/drug-dosages/${dosageId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

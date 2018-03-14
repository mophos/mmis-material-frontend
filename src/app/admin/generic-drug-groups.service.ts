import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericDrugGroupsService {


  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-groups`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(groupName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-groups`, {
        groupName: groupName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(groupId: string, groupName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/${groupId}`, {
        groupName: groupName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(groupId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/drug-groups/${groupId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

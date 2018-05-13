import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericDrugGroupsService {


  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async isActive(id: string, isActive: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/active/${id}`, {
        status: isActive
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  list() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-groups/all`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
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

  save(groupName: string, groupCode: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-groups`, {
        groupName: groupName,
        groupCode: groupCode
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(groupId: string, groupName: string, groupCode: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/${groupId}`, {
        groupName: groupName,
        groupCode: groupCode
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

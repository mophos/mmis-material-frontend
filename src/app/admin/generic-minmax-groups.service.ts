import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericMinmaxGroupsService {
  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all(deleted: boolean) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/minmax-groups?deleted=${deleted}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(minMaxGroupName: string, minMaxGroupCal: any, maxSafety: any, minSafety: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/minmax-groups`, {
        minMaxGroupName: minMaxGroupName,
        minMaxGroupCal: minMaxGroupCal,
        maxSafety: maxSafety,
        minSafety: minSafety
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(minMaxGroupId: string, minMaxGroupName: string, minMaxGroupCal: any, maxSafety: any, minSafety: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/minmax-groups/${minMaxGroupId}`, {
        minMaxGroupName: minMaxGroupName,
        minMaxGroupCal: minMaxGroupCal,
        maxSafety: maxSafety,
        minSafety: minSafety
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  async returnDelete(id: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/minmax-groups/re-deleted?id=${id}`).toPromise();
    return rs.json();
  }
  remove(minMaxGroupId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/minmax-groups/${minMaxGroupId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericDrugGroupsService {


  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

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
  // ############## GROUP 1 ######################
  async isActiveGroup1(groupId: string, isActive: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/active/group1?groupId=${groupId}`, {
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

  getGenericGroup1(isActived) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-groups/group/1?isActived=${isActived}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveGroup1(groupName1: string, groupCode1: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-groups/group1`, {
        groupName1: groupName1,
        groupCode1: groupCode1
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  updateGroup1(groupName1: string, groupCode1: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/group1`, {
        groupName1: groupName1,
        groupCode1: groupCode1
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeGroup1(groupCode1: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/drug-groups/group1?groupCode1=${groupCode1}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  // ################################################
  // ############## GROUP 2 #####################
  async isActiveGroup2(groupCode1, groupCode2, isActive: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/active/group2?groupCode1=${groupCode1}&groupCode2=${groupCode2}`, {
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

  getGenericGroup2(isActived) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-groups/group/2?isActived=${isActived}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveGroup2(groupCode1: string, groupCode2: string, groupName2: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-groups/group2`, {
        groupName2: groupName2,
        groupCode2: groupCode2,
        groupCode1: groupCode1
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  updateGroup2(groupCode1: string, groupCode2: string, groupName2: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/group2`, {
        groupName2: groupName2,
        groupCode2: groupCode2,
        groupCode1: groupCode1
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeGroup2(groupCode2: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/drug-groups/group2?groupCode2=${groupCode2}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}

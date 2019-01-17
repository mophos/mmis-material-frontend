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

  getGenericGroup1(isActived,isDeleted) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-groups/group/1?isActived=${isActived}&isDeleted=${isDeleted}`)
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

  getGenericGroup2(isActived, isDeleted) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-groups/group/2?isActived=${isActived}&isDeleted=${isDeleted}`)
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

  removeGroup2(groupCode1: string, groupCode2: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/drug-groups/group2?groupCode1=${groupCode1}&groupCode2=${groupCode2}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  // ################################################
  // ############## GROUP 3 #####################
  async isActiveGroup3(groupCode1, groupCode2, groupCode3, isActive: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/active/group3?groupCode1=${groupCode1}&groupCode2=${groupCode2}&groupCode3=${groupCode3}`, {
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

  getGenericGroup3(isActived, isDeleted) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-groups/group/3?isActived=${isActived}&isDeleted=${isDeleted}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveGroup3(groupCode1: string, groupCode2: string, groupCode3: string, groupName3: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-groups/group3`, {
        groupName3: groupName3,
        groupCode3: groupCode3,
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

  updateGroup3(groupCode1: string, groupCode2: string, groupCode3: string, groupName3: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/group3`, {
        groupName3: groupName3,
        groupCode3: groupCode3,
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

  removeGroup3(groupCode1: string, groupCode2: string, groupCode3: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/drug-groups/group3?groupCode1=${groupCode1}&groupCode2=${groupCode2}&groupCode3=${groupCode3}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  // ################################################
  // ############## GROUP 4 #####################
  async isActiveGroup4(groupCode1, groupCode2, groupCode3, groupCode4, isActive: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/active/group4?groupCode1=${groupCode1}&groupCode2=${groupCode2}&groupCode3=${groupCode3}&groupCode4=${groupCode4}`, {
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

  getGenericGroup4(isActived, isDeleted) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/drug-groups/group/4?isActived=${isActived}&isDeleted=${isDeleted}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveGroup4(groupCode1: string, groupCode2: string, groupCode3: string, groupCode4: string, groupName4: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/drug-groups/group4`, {
        groupName4: groupName4,
        groupCode4: groupCode4,
        groupCode3: groupCode3,
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

  updateGroup4(groupCode1: string, groupCode2: string, groupCode3: string, groupCode4: string, groupName4: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/drug-groups/group4`, {
        groupName4: groupName4,
        groupCode4: groupCode4,
        groupCode3: groupCode3,
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

  removeGroup4(groupCode1: string, groupCode2: string, groupCode3: string, groupCode4: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/drug-groups/group4?groupCode1=${groupCode1}&groupCode2=${groupCode2}&groupCode3=${groupCode3}&groupCode4=${groupCode4}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async returnDelete1(id: any) {
    const rs: any = await this.authHttp.post(`${this.url}/drug-groups/return1`, {
      id: id
    }).toPromise();
    return rs.json();
  }
  async returnDelete2(id: any) {
    const rs: any = await this.authHttp.post(`${this.url}/drug-groups/return2`, {
      id: id
    }).toPromise();
    return rs.json();
  }
  async returnDelete3(id: any) {
    const rs: any = await this.authHttp.post(`${this.url}/drug-groups/return3`, {
      id: id
    }).toPromise();
    return rs.json();
  }
  async returnDelete4(id: any) {
    const rs: any = await this.authHttp.post(`${this.url}/drug-groups/return4`, {
      id: id
    }).toPromise();
    return rs.json();
  }

}

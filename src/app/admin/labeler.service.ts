import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { ILabeler, IOrganization } from '../models';

@Injectable()
export class LabelerService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('MCD_URL') private mcdUrl: string,
    private authHttp: AuthHttp
  ) { }

  // MCD On Cloud
  mcdGetLabelers() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.mcdUrl}/api/labelers`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  mcdGetLabelersInfo(mophLabelerId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.mcdUrl}/api/labeler`, {
        labeler_id: mophLabelerId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getBank(labelerId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/labelers/bank?labelerId=${labelerId}`, {
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveBank(data) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/labelers/bank`, {
        data: data
      })
        .map(res => res.json())
        .subscribe(d => {
          resolve(d);
        }, error => {
          reject(error);
        });
    });
  }
  updateBank(bankId: any, data) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/labelers/bank?bankId=${bankId}`, {
        data: data
      })
        .map(res => res.json())
        .subscribe(d => {
          resolve(d);
        }, error => {
          reject(error);
        });
    });
  }
  removeBank(bankId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/labelers/bank?bankId=${bankId}`, {
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  mcdSendRegister(labeler: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.mcdUrl}/api/save-labeler`, labeler)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  mcdSaveLabeler(labelerId: string, mcdLabelerId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/labelers/mcd-map`, {
        mcdLabelerId: mcdLabelerId,
        labelerId: labelerId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  // Labeler
  saveLabeler(labeler: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/labelers`, {
        labeler: labeler
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  updateLabeler(labeler: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/labelers`, {
        labeler: labeler
      })
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
      this.authHttp.get(`${this.url}/labelers`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  info(labelerId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/labelers/${labelerId}/info`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(labelerId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/labelers/${labelerId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}

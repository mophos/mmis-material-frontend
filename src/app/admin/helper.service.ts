import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  constructor() { }
  isMOD11(cid: string) {
    if (cid.length !== 13) {
      return false;
    } else {
      const _cid = cid.split('');
      let len = 13;
      let totalCal = 0;
      _cid.forEach((v, i) => {
        totalCal += +v * len;
        len--;
      });

      const mod11 = totalCal % 11;
      return mod11 === 0;
    }
  }
}

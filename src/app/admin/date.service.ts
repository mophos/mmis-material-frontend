import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateService {
  maxDate = new Date(2099, 12, 31);
  minDate = new Date(1980, 1, 1);

  constructor() { }

  isValid(strThaiDate: string): boolean {
    const d: any = strThaiDate.split('/');
    const _strEngDate = `${+d[2] - 543}/${d[1]}/${d[0]}`;
    const valid = moment(_strEngDate, 'DD/MM/YYYY').isValid();
    if (valid) {
      return moment(_strEngDate).isBetween(moment(this.minDate), moment(this.maxDate));
    } else {
      return false;
    }
  }
}
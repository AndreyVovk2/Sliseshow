import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'toDate'
})

export class ToDate implements PipeTransform {
  transform(value: any, formatFrom: string, formatTo: string = 'MM/DD/YYYY'): string {
    return moment(value, formatFrom).format(formatTo);
  }
}

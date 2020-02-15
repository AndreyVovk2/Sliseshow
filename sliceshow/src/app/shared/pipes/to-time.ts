import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toTime'
})

export class ToTime implements PipeTransform {
  transform(value: number): string {
    const hour: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value - (hour * 3600)) / 60);
    const seconds: number = Math.floor(value - (minutes * 60 + hour * 3600));

    const newHour = hour >= 10 ? hour : '0' + hour;
    const newMinutes = minutes >= 10 ? minutes : '0' + minutes;
    const newSeconds = seconds >= 10 ? seconds : '0' + seconds; 

        return newHour + ':' + newMinutes + ':' + newSeconds;
    
       
  }
}

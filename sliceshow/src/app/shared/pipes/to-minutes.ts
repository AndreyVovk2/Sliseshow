import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toMinutes'
})

export class ToMinutes implements PipeTransform {
  transform(value: number): string {
    let seconds: number;
    let minutes: number;
    const roundValue = Math.round(value);
    // Math.round(value);
    minutes = Math.floor(roundValue / 60);
    // minutes = Math.floor(value / 60);
    // seconds = value - minutes * 60;
    seconds = roundValue - minutes * 60;
    // seconds = value;
    // minutes = (seconds >= 60 ? Math.floor(seconds / 60) : 0);
    return (minutes > 0 ? minutes : '0') + ':' + (seconds > 9 ? seconds : '0' + seconds);
    // return (minutes > 0 ? minutes : '00') + ':' + (minutes > 0 ? (seconds - minutes * 60) : seconds);
    // return (minutes > 0 ? minutes : '0') + ':' + (minutes > 0 ? ((seconds - minutes * 60) < 10 ? '0' : '') +
    //  (seconds - minutes * 60) : '00');
  }
}

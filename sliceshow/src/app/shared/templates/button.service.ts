import { Input } from '@angular/core';

export class ButtonService {
    @Input() label = '';
    @Input() primary = false;
    @Input() disabled = false;
    @Input() secondary = false;
    @Input() default = false;

    constructor() { }

}

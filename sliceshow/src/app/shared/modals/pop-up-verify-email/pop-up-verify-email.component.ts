import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pop-up-verify-email',
  templateUrl: 'pop-up-verify-email.component.html',
  styleUrls: ['pop-up-verify-email.component.scss']
})
export class PopUpVerifyEmailComponent implements OnInit {

  /**
   * Леша, это хардкод, я пофиксил ошибку, но чтоб впредь такой хуйни не повторялось
   * */
  store = {
    state: {
      authCredentials: {
        name: 'Aleksey'
      }
    }
  };

  constructor() { }

  ngOnInit() {
  }

}

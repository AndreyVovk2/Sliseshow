import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';


// return localStorage.getItem('currentUser') !== null ? true : false;
@Injectable()

export class LogService {
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  isUser = new BehaviorSubject<object>(JSON.parse(localStorage.getItem('currentUser')));
  /**
   *
   * @returns {Observable<T>}
   */
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  getUser(): Observable<object> {
    return this.isUser.asObservable();
  }

  /**
   *  Login the user then tell all the subscribers about the new status
   */
  login(): void {
    this.isLoginSubject.next(true);
    console.log(this.isLoginSubject);
  }

  /**
   * Log out the user then tell all the subscribers about the new status
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.isLoginSubject.next(false);
  }

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('currentUser');
    //  !== null ? true : false;
  }
}

import {Injectable, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {EditingStore} from './store/editing.store';
// import { Message } from '../model/message';
// import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import { socketIo } from 'socket.io-client';

// const SERVER_URL = 'http://localhost:9000';

// Actions you can take on the App
// export enum Action {
//     JOINED,
//     LEFT,
//     RENAME
// }

// // Socket.io events
// export enum Event {
//     CONNECT = 'connect',
//     DISCONNECT = 'disconnect'
// }


// export interface User {
//     id?: number;
//     name?: string;
//     avatar?: string;
// }

// export interface Message {
//     from?: User;
//     content?: any;
//     action?: Action;
// }
// interface Progress {
//     template_id: number;
//     progress: number;
// }


@Injectable()
export class SocketService {

  // public onload: EventEmitter<Progress> = new EventEmitter();
  public onload = new BehaviorSubject<boolean>(false);
  private socket;

  public initSocket(SERVER_URL): void {
    this.socket = socketIo(SERVER_URL, {
      reconnectionDelay: 3000,
      reconnectionDelayMax: 10000,
      // transports: ['polling']
    });
  }

  public send(message: string): void {
    this.socket.emit('message', message);
  }

  public sendEvent(name: string, data: any): void {
    console.log('socket event started', name);
    console.log(data);
    this.socket.emit(name, data);
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => observer.next(data));
    });
  }

  public onEvent(event: any): Observable<any> {
    console.log('Event start :', event);
    return new Observable<any>(observer => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }

  public disconnect(): void {
    this.socket.close();
  }
}

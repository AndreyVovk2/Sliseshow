
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';


@Injectable()

export class RequestService implements ApiService {


    constructor(public http: HttpClient) {

    }

    public errorHandler(error: HttpErrorResponse) {

    }
    /**
     *
     * @param url
     * @param credentials
     * @param options
     * @returns {Observable<ArrayBuffer>}
     */
    public post(url: string, credentials: any) {
        return this.http.post(url, credentials).pipe(
            tap(() => {
                },
                error => {
                    this.errorHandler(error);
                }));

    }

    /**
     *
     * @param url
     * @param body
     * @returns {Observable<ArrayBuffer>}
     */
    public get(url: string) {
        return this.http.get(url).pipe(
            tap(() => {
                },
                error => {
                    this.errorHandler(error);
                }));
    }

    /**
     *
     * @param url
     * @param credentials
     * @param options
     * @returns {Promise<ArrayBuffer>|Promise<TResult|ArrayBuffer>}
     */
    public put(url: string, credentials: any): Observable<any> {
        return this.http.put(url, credentials).pipe(
            tap(() => {
                },
                error => {
                    this.errorHandler(error);
                }));
    }

    /**
     * DELETE is reserved, I'm using destroy
     * @param url
     * @param options
     * @returns {Promise<ArrayBuffer>|Promise<TResult|ArrayBuffer>}
     */
    public destroy(url: string) {
        return this.http.delete(url).pipe(
            tap(() => {
                },
                error => {
                    this.errorHandler(error);
                }));
    }
}

import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class MainService {

  constructor(
    private http: Http,
    private authHttp: AuthHttp,
    @Inject('API_URL') private url: string
  ) { }

  postEncript(path: string, objData: string) {
    return new Promise((resolve, reject) => {
      let url = `${this.url}/${path}`;
      this.http.post(url, { objData: objData })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    });
  }

  getEncript(path: string) {
    return new Promise((resolve, reject) => {
      let url = `${this.url}/${path}`;
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    });
  }

  postAuthHttp(path: string, objData: string) {
    return new Promise((resolve, reject) => {
      let url = `${this.url}/${path}`;
      this.authHttp.post(url, { objData: objData })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    });
  }

  getAuthHttp(path: string) {
    return new Promise((resolve, reject) => {
      let url = `${this.url}/${path}`;
      this.authHttp.get(url)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    });
  }

}

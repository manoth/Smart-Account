import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { JwtHelper } from 'angular2-jwt';
import { CookieService } from 'ngx-cookie-service';
import { isWebUri } from 'valid-url';

import { CrossStorageHub, CrossStorageClient } from 'cross-storage';

@Injectable()
export class OtherService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private http: Http,
    @Inject('API_URL') private url: string,
    @Inject('MAIN_URL') private mainUrl: string,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) { }

  urlCrossStorageClient() {
    return new Promise((resolve, reject) => {
      let url = `${this.url}/signin/clienturl`;
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    });
  }

  setStorage() {
    let route = this.route;
    let router = this.router;
    this.urlCrossStorageClient()
      .then((url: any) => {
        let host = url.url;
        for (let i = 0; i < host.length; i++) {
          setTimeout(function () {
            let storage = new CrossStorageClient(host[i].url);
            let token = localStorage.getItem('token');
            let setKeys = function () {
              if (host[i].quote == 1) {
                return storage.set(host[i].key, '"' + token + '"');
              } else {
                return storage.set(host[i].key, token);
              }
            };
            storage.onConnect().then(setKeys)
              .then(function () {
                if (host.length == (i + 1)) {
                  let profile = route.snapshot.firstChild.url[0].path;
                  if (profile == 'profile') {
                    router.navigate(['/profile'], { queryParams: { flowEntry: 'ServiceProfile' } });
                  } else {
                    window.location.href = sessionStorage.getItem('followup');
                  }
                }
                storage.close();
              })['catch'](function (err) {
                console.log(err);
                storage.close();
              });
          });
        }
      });
  }

  delStorage() {
    let route = this.route;
    let router = this.router;
    this.urlCrossStorageClient()
      .then((url: any) => {
        let host = url.url;
        let logout = route.snapshot.firstChild.url[0].path;
        for (let i = 0; i < host.length; i++) {
          setTimeout(function () {
            let storage = new CrossStorageClient(host[i].url);
            storage.onConnect().then(function () {
              return storage.del(host[i].key);
            }).then(function () {
              if (host.length == (i + 1)) {
                let logout = route.snapshot.firstChild.url[0].path;
                if (logout == 'logout') {
                  if (sessionStorage.getItem('followup')) {
                    window.location.href = sessionStorage.getItem('followup');
                  } else {
                    router.navigate(['/signin'], { queryParams: { flowEntry: 'ServiceLogin' } });
                  }
                }
              }
            }).catch(function (err) {
              console.log(err);
            });
          });  
        }
      });
  }

  checkToken() {
    let localToken = localStorage.getItem('token');
    if (localToken) {
      if (!this.jwtHelper.isTokenExpired(localToken)) {
        this.setStorage();
        return true;
      } else {
        this.logout();
        return false;
      }
    } else {
      this.logout();
      return false;
    }
  }

  addSession() {
    let followup = this.route.snapshot.queryParams['followup'];
    let cli = this.route.snapshot.queryParams['cli'];
    if (!sessionStorage.getItem('followup') && !isWebUri(followup)) {
      followup = this.mainUrl;
      sessionStorage.setItem('followup', followup);
    } else if (isWebUri(followup)) {
      sessionStorage.setItem('followup', followup);
    }
    if (cli) {
      sessionStorage.setItem('cli', cli);
    }
  }

  checkClientId() {
    let cli = sessionStorage.getItem('cli');
    let params = sessionStorage.getItem('followup');
    return new Promise((resolve, reject) => {
      let url = `${this.url}/signin/clientid/${cli}`;
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (!data.ok) {
            if (params) {
              window.location.href = params;
            } else {
              window.location.href = this.mainUrl;
            }
          } else {
            resolve(data);
          }
        }, error => {
          reject(error);
          window.location.href = this.mainUrl;
        })
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.cookieService.delete('token');
    this.delStorage();
  }

}

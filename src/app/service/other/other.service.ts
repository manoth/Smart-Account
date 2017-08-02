import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { CookieService } from 'ngx-cookie-service';
import { isWebUri } from 'valid-url';

@Injectable()
export class OtherService {

  constructor(
    private http: Http,
    @Inject('API_URL') private url: string,
    @Inject('MAIN_URL') private mainUrl: string,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) { }

  checkToken() {
    let localToken = localStorage.getItem('token');
    let cookieToken = this.cookieService.get('tokrn');
    if (localToken || cookieToken) {
      this.router.navigate(['/profile'], { queryParams: { flowEntry: 'ServiceProfile' } });
      return true;
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

}

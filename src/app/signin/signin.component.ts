import { Component, OnInit, Input, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { isWebUri } from 'valid-url';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { CookieService } from 'ngx-cookie-service';
import { MainService } from '../service/main/main.service';
import { EncryptService } from '../service/encript/encript.service';
import { OtherService } from '../service/other/other.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        animate(300, keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(60px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-60px)', offset: 0.7 }),
          style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class SigninComponent implements OnInit {

  tokenExpired: boolean;
  showLogin: boolean;
  loginForm: boolean = true;
  isFocused: boolean = true;
  username: string;
  password: string;
  remember: boolean = false;
  arrAccount: any[];
  arrSysten: any[];
  qParams: string = 'ServiceLogin';
  hasErrorUser: string;
  hasErrorPass: string;
  countSignin: number = 0;

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    @Inject('MAIN_URL') private mainUrl: string,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private mainService: MainService,
    private encryptService: EncryptService,
    private otherService: OtherService
  ) {
    let pageHeader = this.route.snapshot.data['pageHeader'];
    this.title.setTitle(pageHeader);
    try {
      let localToken = localStorage.getItem('token');
      this.tokenExpired = this.jwtHelper.isTokenExpired(localToken);
      this.otherService.checkToken();
    } catch (err) {
      this.tokenExpired = true;
    }
  }

  ngOnInit() {
    this.otherService.addSession();
    this.otherService.checkClientId()
      .then((data: any) => {
        let system = data.data;
        this.arrSysten = JSON.parse(this.encryptService.decrypt(system));
      })
      .catch((error: any) => {
        console.log(error);
      });
    let params = sessionStorage.getItem('followup');
    let objParams = { followup: params, flowEntry: 'ServiceLogin' };
    let username = localStorage.getItem('ACCOUNT');
    if (username) {
      this.onUsername(username, objParams);
    } else {
      this.router.navigate(['/signin'], { queryParams: objParams });
      this.showLogin = true;
    }
  }

  submitUser(form: any): void {
    let objParams = { flowEntry: 'ServicePass' };
    let username = form.username;
    if (username) {
      this.onUsername(username, objParams);
    } else {
      this.hasErrorUser = '*กรุณาป้อนบัญชีผู้ใช้ หรือ เลขประจำตัวประชาชน';
    }
    document.getElementById('username').focus();
  }

  onUsername(username, objParams) {
    let objData = { username: username };
    let encData = this.encryptService.encrypt(JSON.stringify(objData));
    let path = 'signin/username';
    this.mainService.postEncript(path, encData)
      .then((data: any) => {
        if (data.ok) {
          this.loginForm = false;
          let decData = this.encryptService.decrypt(data.data);
          let res = JSON.parse(decData);
          this.arrAccount = res[0];
          localStorage.setItem('ACCOUNT', res[0].accountid);
          this.router.navigate(['/signin'], { queryParams: objParams });
        } else {
          this.hasErrorUser = data.data;
        }
        this.showLogin = true;
      })
      .catch((error: any) => {
        console.log(error);
        this.hasErrorUser = error.error;
      });
  }

  submitPass(form: any): void {
    let password = form.password;
    let remember = form.remember;
    if (password) {
      this.onSignin(password, remember);
    } else {
      this.hasErrorPass = '*กรุณาป้อนรหัสผ่านของคุณ';
    }
    this.countSignin++;
    document.getElementById('password').focus();
  }

  onSignin(password, remember) {
    let objData = {
      cli: sessionStorage.getItem('cli'),
      username: localStorage.getItem('ACCOUNT'),
      password: password,
      remember: remember
    };
    let encData = this.encryptService.encrypt(JSON.stringify(objData));
    let path = 'signin/signin';
    this.mainService.postEncript(path, encData)
      .then((res: any) => {
        if (res.ok) {
          // console.log(res);
          let token = res.token;
          localStorage.setItem('token', token);
          this.otherService.checkToken();
        } else {
          this.password = null;
          this.hasErrorPass = res.data;
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.hasErrorPass = error.error;
      });
  }

  clearAccount() {
    localStorage.removeItem('ACCOUNT');
    this.loginForm = true;
    this.hasErrorPass = undefined;
    this.username = null;
    this.password = null;
  }

}
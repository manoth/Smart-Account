import { Component, OnInit, Input, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { isWebUri } from 'valid-url';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import swal from 'sweetalert2';

import { MainService } from '../service/main/main.service';
import { EncryptService } from '../service/encript/encript.service';
import { OtherService } from '../service/other/other.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
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
export class SignupComponent implements OnInit {

  tokenExpired: boolean;
  namePages: Array<object> = [
    { name: 'ข้อมูลการเข้าสู่ระบบ', icon: 'fa-sign-in', color: 'blue' },
    { name: 'ข้อมูลส่วนตัว', icon: 'fa-user', color: 'green' },
    { name: 'สถานที่ปฏิบัติงานจริง', icon: 'fa-home', color: 'red' }
  ];
  arrSysten: any[];
  signupPage: number = 1;
  dataFormPage: object;
  buttonLogout: boolean = false;
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(
    @Inject('MAIN_URL') private mainUrl: string,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private mainService: MainService,
    private encryptService: EncryptService,
    private otherService: OtherService
  ) {
    let pageHeader = this.route.snapshot.data['pageHeader'];
    this.title.setTitle(pageHeader);
    try {
      let localToken = localStorage.getItem('token');
      this.tokenExpired = this.jwtHelper.isTokenExpired(localToken);
      this.otherService.checkToken()
    } catch (err) {
      this.tokenExpired = true;
    } 
    // if (!this.otherService.checkToken()) {
    //   this.router.navigate(['/signup'], { queryParams: { 'flowEntry': 'ServiceRegister' } });
    // }
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
    this.router.navigate(['/signup'], { queryParams: { 'flowEntry': 'ServiceRegister' } });
  }

  newPage(e) {
    this.signupPage = e.page;
    this.dataFormPage = e;
  }

}

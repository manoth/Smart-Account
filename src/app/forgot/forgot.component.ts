import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import swal from 'sweetalert2';

import { MainService } from '../service/main/main.service';
import { EncryptService } from '../service/encript/encript.service';
import { OtherService } from '../service/other/other.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
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
export class ForgotComponent implements OnInit {

  tokenExpired: boolean;
  arrSysten: any[];
  isFocused: boolean = true;
  loading: boolean = false;
  hasErrorCid: string;
  Cid: string;

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private title: Title,
    private mainService: MainService,
    private encryptService: EncryptService,
    private otherService: OtherService,
    private router: Router,
    private route: ActivatedRoute
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
    this.router.navigate(['/forgot'], { queryParams: { 'flowEntry': 'ServiceForgot' } });
  }

  submitForgot(form) {
    if (form.Cid) {
      this.loading = true;
      this.onCid(form.Cid);
    } else {
      this.hasErrorCid = '*กรุณาป้อนเลขประจำตัวประชาชน!';
    }
  }

  onCid(cid) {
    document.getElementById('Cid').focus();
    let path = 'forgot/sendmail';
    let objData = {
      cid: cid,
      followup: sessionStorage.followup,
      cli: sessionStorage.cli
    };
    let encData = this.encryptService.encrypt(JSON.stringify(objData));
    this.mainService.postEncript(path, encData)
      .then((data: any) => {
        // console.log(data);
        this.loading = false;
        if (data.ok) {
          this.sweetAlert(data.email,1);
        } else {
          this.sweetAlert(cid,2);
          this.Cid = null;
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  sweetAlert(txt: string, id: number) {
    let router = this.router;
    if (id===1) {
      swal({
        title: 'โปรดอ่านคำแนะนำ!',
        text: `เราได้ทำการส่งคำขอรีเซ็ตรหัสผ่านของคุณ 
          ไปยัง ${txt} เรียบร้อยแล้ว. \n
          กรุณาไปเปิด Email ของคุณ \n 
          หากที่อยู่ Email ที่ส่งไปไม่ถูกต้อง \n
          กรุณาติดต่อ 044-836826 ต่อ 206.`,
        type: 'success',
        confirmButtonText: 'ตกลง',
        allowOutsideClick: false
      }).then(function () {
        router.navigate(['/signin'], { queryParams: { 'flowEntry': 'ServiceLogin' } });
      });
    } else {
      swal({
        title: 'เสียใจด้วย!',
        text: `หมายเลขประจำตัวประชาชน ${txt}
          นี้ยังไม่เคยลงทะเบียนเข้าใช้งานระบบ 
          Smart Account นี้มาก่อน \n
          คุณต้องการที่จะลงทะเบียนเข้าใช้งานใหม่หรือไม่ ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        allowOutsideClick: false
      }).then(function () {
        router.navigate(['/signup'], { queryParams: { 'flowEntry': 'ServiceRegister' } });
      }, function (close) {
        console.log(close);
      });
    }  
  }

  clearAccount() {
    localStorage.removeItem('ACCOUNT');
  }

}
